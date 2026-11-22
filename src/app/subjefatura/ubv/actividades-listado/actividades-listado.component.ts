import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActividadesService } from '../../services/ubv/actividades.service';
import { VoluntariosActividades } from '../../models/voluntarios.molde';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BadgeComponent, ButtonDirective, ThemeDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, FormLabelDirective, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective, ButtonCloseDirective } from '@coreui/angular';

import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-actividades-listado',
  imports: [FiltroGeneralPipe, FormsModule, ThemeDirective, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent,
    CardBodyComponent, ButtonDirective, RouterLink, TableDirective, FormLabelDirective, InputGroupComponent, InputGroupTextDirective,
    ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective,
    ButtonCloseDirective],
  templateUrl: './actividades-listado.component.html',
  styleUrls: ['./actividades-listado.component.scss']
})
export class ActividadesListadoComponent implements OnInit {

  actividades: VoluntariosActividades[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';

  pdfUrl: SafeResourceUrl | null = null;
  reporteDesde: string = '';
  reporteHasta: string = '';

  constructor(private _actividadesService: ActividadesService, private _authService: AuthService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.actividades = [];
    this.errorMessage = '';
    this._actividadesService.getAll().subscribe({
      next: (data) => this.actividades = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    });
  }

  eliminarActividad(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la actividad de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._actividadesService.delete(id).subscribe({
          next: () => {
            this.actividades = this.actividades.filter(a => a.actividad_id !== id);
            Swal.fire(
              'Eliminado',
              'La actividad ha sido eliminada correctamente.',
              'success'
            );
          },
          error: (e) => {
            console.error(e);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la actividad.',
              'error'
            );
          }
        });
      }
    });
  }

  generarReporte() {
    const usuario = this._authService.getUsuario();
    console.log('Generando reporte para usuario:', usuario.usuario);
    this._actividadesService.getReporte(usuario.usuario.voluntario_id, this.reporteDesde, this.reporteHasta)
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
  }
}
