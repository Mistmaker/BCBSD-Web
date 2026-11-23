import { IntervencionesService } from './../../subjefatura/services/intervenciones.service';
import { PersonalService } from './../../tthh/services/personal.service';
import { EstacionesModel } from './../../subjefatura/models/estadisticas.model';
import { PersonalModel } from './../../tthh/models/personal.model';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { ButtonDirective, ButtonCloseDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ListGroupDirective, ListGroupItemDirective, RowComponent, TabDirective, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent, TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective } from '@coreui/angular';
import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { DistributivoService } from '../services/distributivo.service';
import { AuthService } from '../../auth/auth.service';
import { forkJoin, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import { Cargos, DistributivoModel, TropasModel } from './../models/distributivo.model';

@Component({
  selector: 'app-distributivo-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent,
    ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink, ListGroupDirective, ListGroupItemDirective,
    TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TextColorDirective, FormDirective,
    FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent,
    ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective, ButtonCloseDirective],
  templateUrl: './distributivo-mantenimiento.component.html',
  styleUrl: './distributivo-mantenimiento.component.scss'
})
export class DistributivoMantenimientoComponent implements OnInit {

  distributivo: DistributivoModel = new DistributivoModel();
  personal: PersonalModel[] = [];
  personalAsignado: PersonalModel[] = []; // Array temporal para almacenar personal asignado
  estaciones: EstacionesModel[] = [];
  cargoEstaciones: any[] = [
    "ENCARGADO DE ESTACION",
    "RESPONSABLE DE GUARDIA",
    "SUBALTERNO DE GUARDIA",
    "RESPONSABLE DE EQUIPOS DE RESCATE",
    "OPERADOR",
    "APOYO A EMERGENCIAS",
    "ATENCION PREHOSPITALARIA",
    "ASISTENTE PREHOSPITALARIA",
    "APOYO DE SUBJEFATURA DE BOMBEROS",
    "APOYO CAPACITACION EN PREVENCION Y PRIMEROS AUXILIOS",
    "ECU-911 CONSOLA DE DESPACHO Y APOYO A EMERGENCIAS",
  ];

  cargosApoyos: any[] = [];
  tmpGrupoSeleccionado = 0; //variable temporal para seleccion de personal
  tmpCargoSeleccionado = ''; //variable temporal para seleccion de personal
  tmpPersonalSelccionado = 0; //variable temporal para seleccion de personal

  // conductores: PersonalModel[] = [];
  errorMessage: string = '';
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;

  Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 7000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  private todoPersonal: PersonalModel[] = []; // catálogo completo de personal (fuente de verdad)
  isSaving = false;

  constructor(private _distributivoService: DistributivoService, private _personalService: PersonalService, private _intervencionesService: IntervencionesService, private _authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const routeStr = this.route.snapshot.paramMap.get('id');
    const distributivoId = routeStr !== null && routeStr !== 'nuevo' ? Number(routeStr) : null;

    // Se cargan los catálogos y el distributivo en paralelo, pero el personal asignado
    // solo se calcula cuando TODO llegó, evitando la condición de carrera.
    forkJoin({
      personal: this._personalService.getAll(),
      estaciones: this._intervencionesService.getEstaciones(),
      distributivo: distributivoId ? this._distributivoService.getById(distributivoId) : of(null),
      grupos: distributivoId ? this._distributivoService.getPelotones(distributivoId) : of(null),
    }).subscribe({
      next: ({ personal, estaciones, distributivo, grupos }) => {
        this.todoPersonal = personal;
        this.estaciones = estaciones;
        if (distributivo) {
          this.distributivo = distributivo;
          this.distributivo.grupos = grupos ?? [];
        }
        this.sincronizarPersonalAsignado();
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      }
    });
  }

  /**
   * Recalcula las listas de personal disponible y asignado a partir de los puestos
   * presentes en el distributivo. Una persona sigue como asignada mientras ocupe al
   * menos un puesto (p. ej. un encargado de estación presente en varios grupos).
   */
  private sincronizarPersonalAsignado(): void {
    const idsAsignados = new Set<number>();
    this.distributivo.grupos.forEach(grupo =>
      grupo.pelotones.forEach(peloton =>
        peloton.cargos.forEach(cargo =>
          cargo.puestos.forEach((puesto: TropasModel) => idsAsignados.add(puesto.fk_personal_id))
        )
      )
    );
    this.personal = this.todoPersonal.filter(p => !idsAsignados.has(p.ppersonal_id));
    this.personalAsignado = this.todoPersonal.filter(p => idsAsignados.has(p.ppersonal_id));
  }

  seleccionarGrupo(idGrupo: number) {
    this.tmpGrupoSeleccionado = idGrupo;
  }

  asignarPersonal(event: any, cargo: Cargos, cargoNombre: string, dist_pelo_id: number) {
    if (!event) { return; } // ng-select emite undefined al limpiar la selección

    // Crear la nueva tropa con los datos seleccionados
    const nueva_tropa: TropasModel = new TropasModel();
    nueva_tropa.fk_personal_id = event.ppersonal_id; // ID del personal seleccionado
    nueva_tropa.tropa_cargo = cargoNombre;
    nueva_tropa.tropa_estado = 'ACTIVO';
    nueva_tropa.fk_usuario_id = this._authService.getUsuarioId()!;
    nueva_tropa.fk_dist_pelo_id = dist_pelo_id;
    nueva_tropa.tropa_nombre_completo = event.nombre_completo; // Nombre completo del personal seleccionado

    // Asignar la tropa al cargo actual
    cargo.puestos.push(nueva_tropa);

    // Buscar la estación correspondiente al grupo actual
    const estacion = this.distributivo.grupos.find(grupo =>
      grupo.pelotones.some(peloton => peloton.dist_pelo_id === dist_pelo_id)
    );
    const grupoSeleccionadoEsPrimero = estacion?.pelotones[0]?.dist_pelo_id === dist_pelo_id;

    // El encargado asignado en el primer grupo queda a cargo de todos los grupos de la estación.
    // Si luego se quita de un grupo puntual (vacaciones, permiso, etc.) permanece en los demás.
    if (cargoNombre === 'ENCARGADO DE ESTACION' && estacion && grupoSeleccionadoEsPrimero) {
      estacion.pelotones.forEach(peloton => {
        const cargoEnGrupo = peloton.cargos.find(c => c.cargo_nombre === cargoNombre);
        if (cargoEnGrupo) {
          const yaAsignado = cargoEnGrupo.puestos.some(puesto => puesto.fk_personal_id === event.ppersonal_id);
          if (!yaAsignado) {
            const tmp_nueva_tropa = { ...nueva_tropa, fk_dist_pelo_id: peloton.dist_pelo_id };
            cargoEnGrupo.puestos.push(tmp_nueva_tropa);
          }
        }
      });
    }

    this.sincronizarPersonalAsignado();
    // Resetear la selección temporal
    this.tmpPersonalSelccionado = 0;
  }

  removerAsignacion(personal: TropasModel, cargo: Cargos, estacionId: number) {
    // Se quita solo de este cargo/grupo; si sigue en otros grupos continúa como asignado
    cargo.puestos = cargo.puestos.filter(puesto => puesto.fk_personal_id !== personal.fk_personal_id);
    this.sincronizarPersonalAsignado();
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) { Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning'); return; }
    if (this.isSaving) { return; }

    this.distributivo.fk_usuario_id = this._authService.getUsuarioId()!;
    const esNuevo = !this.distributivo.distributivo_id;
    const request = esNuevo
      ? this._distributivoService.save(this.distributivo)
      : this._distributivoService.update(this.distributivo);

    this.isSaving = true;
    request.pipe(
      switchMap((data) => {
        this.distributivo.distributivo_id = data.id;
        // Recargar los grupos desde el servidor para reflejar el estado guardado
        return this._distributivoService.getPelotones(this.distributivo.distributivo_id).pipe(
          map(grupos => ({ data, grupos }))
        );
      }),
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: ({ data, grupos }) => {
        this.distributivo.grupos = grupos;
        this.sincronizarPersonalAsignado();
        Swal.fire('Listo', data.msg, 'success');
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
        this.Toast.fire({
          icon: 'error',
          title: (e.error?.error ?? 'Error') + '<br>' + (e.error?.msg ?? e.message)
        });
      }
    });
  }

  onReset1() {
    this.customStylesValidated = false;
    this.distributivo = new DistributivoModel();
    this.sincronizarPersonalAsignado();
  }

}
