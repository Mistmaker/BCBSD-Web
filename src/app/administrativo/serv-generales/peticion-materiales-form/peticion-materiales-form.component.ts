import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent, BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormCheckComponent,
  FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective, FormLabelDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../../auth/auth.service';
import { PdfService } from '../../../core/pdf.service';
import { PersonalModel } from '../../../tthh/models/personal.model';
import { PersonalService } from '../../../tthh/services/personal.service';
import {
  ConfigPeticion, erroresPeticion, itemVacio, PeticionGuardar, PeticionMaterialesModel, peticionParaGuardar
} from '../../models/peticion-materiales.model';
import { PeticionMaterialesService } from '../../services/peticion-materiales.service';

@Component({
  selector: 'app-peticion-materiales-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, AlertComponent, TableDirective, FormControlDirective, FormLabelDirective, FormCheckComponent, FormCheckInputDirective,
    FormCheckLabelDirective, SpinnerComponent],
  templateUrl: './peticion-materiales-form.component.html',
  styles: [`.col-cantidad { width: 120px; } .col-unidad { width: 170px; } .col-accion { width: 44px; }`]
})
export class PeticionMaterialesFormComponent implements OnInit {
  peticion: PeticionMaterialesModel | null = null;
  config: ConfigPeticion = { unidades: [], autoriza: null, ciudad: '' };
  personal: PersonalModel[] = [];
  datos: PeticionGuardar = this.vacia();
  cargando = true;
  guardando = false;
  validado = false;

  constructor(public auth: AuthService, private servicio: PeticionMaterialesService, private personalService: PersonalService, private pdf: PdfService,
              private route: ActivatedRoute, private router: Router) { }

  get puedeEditar(): boolean { return this.auth.tienePermiso('ADM_PETICION_MATERIALES_GESTIONAR') && this.peticion?.peticion_estado !== 'ANULADA'; }
  get esNueva(): boolean { return !this.peticion; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const peticionId = id && id !== 'nuevo' ? Number(id) : null;
    forkJoin({
      config: this.servicio.getConfig(),
      personal: this.personalService.getTodos(),
      peticion: peticionId ? this.servicio.getById(peticionId) : of(null),
    }).subscribe({
      next: ({ config, personal, peticion }) => {
        this.config = config;
        this.personal = personal;
        if (peticion) {
          this.cargarPeticion(peticion);
        } else {
          this.datos.peticion_lugar = config.ciudad ?? '';
          if (config.autoriza) {
            this.datos.autoriza_id = config.autoriza.ppersonal_id;
            this.datos.autoriza_cargo = config.autoriza.puesto_nombre ?? '';
          }
        }
        this.cargando = false;
      },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); }
    });
  }

  private vacia(): PeticionGuardar {
    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    return { peticion_fecha: fecha, peticion_lugar: '', peticion_destino: '', peticion_autorizado_para: null, solicitante_id: null, solicitante_cargo: '',
             autoriza_id: null, autoriza_cargo: '', peticion_observaciones: '', detalle: [itemVacio(), itemVacio(), itemVacio()] };
  }

  private cargarPeticion(p: PeticionMaterialesModel): void {
    this.peticion = p;
    this.datos = {
      peticion_id: p.peticion_id, peticion_fecha: p.peticion_fecha, peticion_lugar: p.peticion_lugar ?? '', peticion_destino: p.peticion_destino,
      peticion_autorizado_para: p.peticion_autorizado_para, solicitante_id: p.solicitante_id, solicitante_cargo: p.solicitante_cargo ?? '',
      autoriza_id: p.autoriza_id, autoriza_cargo: p.autoriza_cargo ?? '', peticion_observaciones: p.peticion_estado === 'ANULADA' ? '' : (p.peticion_observaciones ?? ''),
      detalle: (p.detalle ?? []).map(d => ({ detalle_cantidad: Number(d.detalle_cantidad), detalle_unidad: d.detalle_unidad, detalle_descripcion: d.detalle_descripcion })),
    };
  }

  /** Al elegir a una persona se propone su puesto como cargo (editable) */
  alElegirPersona(campo: 'solicitante' | 'autoriza', persona: PersonalModel | null): void {
    const cargo = campo === 'solicitante' ? 'solicitante_cargo' : 'autoriza_cargo';
    this.datos[cargo] = persona?.puesto_nombre ?? '';
  }

  agregarFila(): void {
    this.datos.detalle.push(itemVacio());
  }

  quitarFila(i: number): void {
    this.datos.detalle.splice(i, 1);
    if (!this.datos.detalle.length) { this.agregarFila(); }
  }

  /** Enter en la descripción de la última fila agrega otra (digitación rápida) */
  alEnterDescripcion(i: number, evento: Event): void {
    evento.preventDefault();
    if (i === this.datos.detalle.length - 1) { this.agregarFila(); }
    setTimeout(() => (document.getElementById(`cantidad-${i + 1}`) as HTMLInputElement | null)?.focus());
  }

  errores(): string[] {
    return erroresPeticion(this.datos);
  }

  guardar(): void {
    this.validado = true;
    const errores = this.errores();
    if (errores.length) {
      Swal.fire('Atención', errores.join('<br>'), 'warning');
      return;
    }
    if (this.guardando) { return; }
    this.guardando = true;
    this.servicio.guardar(peticionParaGuardar(this.datos)).subscribe({
      next: (r) => {
        this.guardando = false;
        Swal.fire({ icon: 'success', title: r.msg, text: `Petición de materiales ${r.peticion_codigo}`, showCancelButton: true,
                    confirmButtonText: 'Imprimir', cancelButtonText: 'Cerrar' })
          .then(x => {
            if (x.isConfirmed) { this.pdf.abrir(this.servicio.urlPdf(r.id)); }
            this.router.navigate(['/admin/peticiones-materiales']);
          });
      },
      error: (e) => { this.guardando = false; Swal.fire('No se pudo guardar', e.error?.msg ?? e.error?.error ?? e.message, 'error'); }
    });
  }

  imprimir(): void {
    if (this.peticion) { this.pdf.abrir(this.servicio.urlPdf(this.peticion.peticion_id)); }
  }

  anular(): void {
    if (!this.peticion) { return; }
    Swal.fire({ title: `Anular ${this.peticion.peticion_codigo}`, input: 'text', inputLabel: 'Motivo de la anulación', showCancelButton: true,
                confirmButtonText: 'Anular', cancelButtonText: 'Cancelar', confirmButtonColor: '#bf0411',
                inputValidator: (v) => v?.trim() ? undefined : 'Indique el motivo' })
      .then(x => {
        if (!x.isConfirmed) { return; }
        this.servicio.anular(this.peticion!.peticion_id, x.value.trim()).subscribe({
          next: (r) => { Swal.fire('Listo', r.msg, 'success'); this.router.navigate(['/admin/peticiones-materiales']); },
          error: (e) => Swal.fire('No se pudo anular', e.error?.msg ?? e.message, 'error'),
        });
      });
  }

  rastrear = (i: number) => i;
}
