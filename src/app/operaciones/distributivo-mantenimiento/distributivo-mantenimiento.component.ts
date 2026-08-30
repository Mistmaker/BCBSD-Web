import { IntervencionesService } from './../../subjefatura/services/intervenciones.service';
import { PersonalService } from './../../tthh/services/personal.service';
import { EstacionesModel } from './../../subjefatura/models/estadisticas.model';
import { PersonalModel } from './../../tthh/models/personal.model';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import {
  AlertComponent,
  AlertHeadingDirective,
  BorderDirective,
  ButtonDirective,
  ButtonCloseDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  GutterDirective,
  ListGroupDirective,
  ListGroupItemDirective,
  RowComponent,
  TabDirective,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
  TableDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
} from '@coreui/angular';
import Swal from 'sweetalert2';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { DistributivoService } from '../services/distributivo.service';

import { Cargos, DistributivoModel, PelotonesModel, TropasModel } from './../models/distributivo.model';

@Component({
  selector: 'app-distributivo-mantenimiento',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent,
    TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, AlertComponent,
    AlertHeadingDirective,
    TableDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective,
    ButtonCloseDirective,
    // DragDropModule
  ],
  templateUrl: './distributivo-mantenimiento.component.html',
  styleUrl: './distributivo-mantenimiento.component.scss'
})
export class DistributivoMantenimientoComponent {

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

  constructor(private _distributivoService: DistributivoService, private _personalService: PersonalService, private _intervencionesService: IntervencionesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Obteniendo personal (solicitantes)
    this._personalService.getAll().subscribe({
      next: (data) => {
        this.personal = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete 1')
    })

    //Obteniendo estaciones
    this._intervencionesService.getEstaciones().subscribe({
      next: (data) => {
        this.estaciones = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
      },
      complete: () => console.info('complete 2')
    });

    // this.cargarDatos();
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      this._distributivoService.getById(+routeStr).subscribe({
        next: (data) => {
          this.distributivo = data;
          this._distributivoService.getPelotones(+routeStr).subscribe({
            next: (data) => {
              this.distributivo.grupos = data;
              console.log(this.personal);
              // pasar a personal asignado a todo el personal que ya venga asignado en el distributivo
              this.distributivo.grupos.forEach(grupo => {
                grupo.pelotones.forEach(peloton => {
                  peloton.cargos.forEach(cargo => {
                    cargo.puestos.forEach((puesto: TropasModel) => {
                      const personalAsignado = this.personal.find(persona => persona.ppersonal_id === puesto.fk_personal_id);
                      if (personalAsignado) {
                        this.personalAsignado.push(personalAsignado);
                        this.personal = this.personal.filter(persona => persona.ppersonal_id !== puesto.fk_personal_id);
                      }
                    });
                  });
                });
              });
            },
            error: (e) => {
              console.error(e);
              Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
            },
            complete: () => console.info('complete 4')
          })
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete 3')
      })
    }

    

    

  }

  seleccionarGrupo(idGrupo: number) {
    this.tmpGrupoSeleccionado = idGrupo;
  }

  asignarPersonal(event: any, cargo: Cargos, cargoNombre: string, dist_pelo_id: number) {
    console.log('Selection changed:', event, cargo, cargoNombre, dist_pelo_id);

    // Crear la nueva tropa con los datos seleccionados
    let nueva_tropa: TropasModel = new TropasModel();
    nueva_tropa.fk_personal_id = event.ppersonal_id; // ID del personal seleccionado
    nueva_tropa.tropa_cargo = cargoNombre;
    nueva_tropa.tropa_estado = 'ACTIVO';
    nueva_tropa.fk_usuario_id = 1; // ID del usuario actual (puedes obtenerlo desde un servicio de autenticación)
    nueva_tropa.fk_dist_pelo_id = dist_pelo_id;
    nueva_tropa.tropa_nombre_completo = event.nombre_completo; // Nombre completo del personal seleccionado

    // Asignar la tropa al cargo actual
    cargo.puestos.push(nueva_tropa);

    // Buscar la estación correspondiente al grupo actual
    const estacion = this.distributivo.grupos.find(grupo =>
      grupo.pelotones.some(peloton => peloton.dist_pelo_id === dist_pelo_id)
    );

    if (cargoNombre == 'ENCARGADO DE ESTACION') {
      if (estacion) {
        // Iterar sobre los grupos (pelotones) de la estación
        estacion.pelotones.forEach(peloton => {
          console.log('Pelotón:', peloton);
          // Buscar el cargo correspondiente en cada grupo
          const cargoEnGrupo = peloton.cargos.find(c => c.cargo_nombre === cargoNombre);
          console.log('Cargo en grupo:', cargoEnGrupo);
          if (cargoEnGrupo) {
            // Verificar si el personal ya está asignado en este grupo
            const yaAsignado = cargoEnGrupo.puestos.some(puesto => puesto.fk_personal_id === event.ppersonal_id);
            console.log('¿Personal ya asignado en este grupo?', yaAsignado);
            if (!yaAsignado) {
              // Asignar la tropa al cargo en este grupo
              // console.log('Tropa a asignar:', nueva_tropa);
              // nueva_tropa.fk_dist_pelo_id = peloton.dist_pelo_id; // Actualizar el ID del pelotón para esta tropa
              const tmp_nueva_tropa = { ...nueva_tropa }; // Crear una copia de la tropa para evitar mutaciones no deseadas
              tmp_nueva_tropa.fk_dist_pelo_id = peloton.dist_pelo_id; // Actualizar el ID del pelotón para esta tropa
              console.log('Tropa actualizada con ID de pelotón:', tmp_nueva_tropa);
              cargoEnGrupo.puestos.push({ ...tmp_nueva_tropa });
            }
          }
          console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        });
      }
    }

    // Mover el personal asignado al array temporal
    const personalAsignado = this.personal.find(persona => persona.ppersonal_id === event.ppersonal_id);
    if (personalAsignado) {
      this.personalAsignado.push(personalAsignado);
      this.personal = this.personal.filter(persona => persona.ppersonal_id !== event.ppersonal_id);
    }
    // Resetear la selección temporal
    this.tmpPersonalSelccionado = 0;
  }

  removerAsignacion(personal: TropasModel, cargo: Cargos, estacionId: number) {
    // Remover al personal del cargo actual
    cargo.puestos = cargo.puestos.filter(puesto => puesto.fk_personal_id !== personal.fk_personal_id);

    // Buscar el personal en el array temporal
    const personalRemovido = this.personalAsignado.find(p => p.ppersonal_id === personal.fk_personal_id);
    console.log('Personal removido:', personalRemovido);
    if (personalRemovido) {
      // Mover el personal de vuelta al array principal
      // this.personal.push(personalRemovido);
      this.personal = [...this.personal, personalRemovido];
      this.personalAsignado = this.personalAsignado.filter(p => p.ppersonal_id !== personal.fk_personal_id);
      console.log('Personal', this.personal);
    }

    console.log(`Personal con ID ${personal.fk_personal_id} removido de la asignación en la estación ${estacionId}`);
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) { Swal.fire('Atencion', 'Algunos campos están incorrectos o vacios, por favor revise e intente nuevamente', 'warning'); return; }
    console.log('Submit... 1', form);
    // this.intervencion.fk_usuario_id = this._authService.getUsuario()['usuario']['usuario_id'];
    console.log(this.distributivo);
    this._distributivoService.save(this.distributivo).subscribe({
      next: (data) => {
        console.log(data)
        this.distributivo.distributivo_id = data.id;
        Swal.fire('Listo', data.msg, 'success')
        // this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
        this.Toast.fire({
          icon: 'error',
          title: e.error.error + '<br>' + e.error.msg
        });
      },
      complete: () => console.info('complete')
    })
  }

  onReset1() {
    this.customStylesValidated = false;
    this.distributivo = new DistributivoModel();
    console.log('Reset... 1');
  }

}
