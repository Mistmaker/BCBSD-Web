import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AsignacionService } from '../../services/ubv/asignacion.service';
import { AsignacionUbvModel } from '../../models/voluntarios.molde';

import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  BadgeComponent,
  BorderDirective,
  ButtonDirective,
  ButtonGroupComponent,
  ThemeDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
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
  TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective
} from '@coreui/angular';

import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';

@Component({
  selector: 'app-asignacion-listado',
  imports: [FiltroGeneralPipe, FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective],
  templateUrl: './asignacion-listado.component.html',
  styleUrls: ['./asignacion-listado.component.scss']
})
export class AsignacionListadoComponent implements OnInit {

  asignaciones: AsignacionUbvModel[] = [];
  voluntario_id: number | null = null;
  filtroBusqueda = '';
  errorMessage: string = '';

  constructor(private _asignacionService: AsignacionService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.asignaciones = [];
    this.errorMessage = '';

    const loginVoluntario = this._authService.getUsuario();
    if (loginVoluntario.usuario.voluntario_id) {
      this.voluntario_id = loginVoluntario.usuario.voluntario_id;
    }

    this._asignacionService.getAll().subscribe({
      next: (data) => this.asignaciones = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    });
  }

  eliminarAsignacion(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la asignación de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._asignacionService.delete(id).subscribe({
          next: () => {
            this.asignaciones = this.asignaciones.filter(a => a.asignacion_id !== id);
            Swal.fire(
              'Eliminado',
              'La asignación ha sido eliminada correctamente.',
              'success'
            );
          },
          error: (e) => {
            console.error(e);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar la asignación.',
              'error'
            );
          }
        });
      }
    });
  }
}
