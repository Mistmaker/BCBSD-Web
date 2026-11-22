import { Component, OnInit } from '@angular/core';
import { VoluntariosService } from '../../services/ubv/voluntarios.service';
import { Voluntarios } from '../../models/voluntarios.molde';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';


import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';


@Component({
  selector: 'app-voluntarios-listado',
  imports: [FiltroGeneralPipe, FormsModule, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent,
    CardBodyComponent, ButtonDirective, RouterLink, TableDirective, InputGroupComponent, InputGroupTextDirective],
  templateUrl: './voluntarios-listado.component.html',
  styleUrls: ['./voluntarios-listado.component.scss']
})
export class VoluntariosListadoComponent implements OnInit {

  voluntarios: Voluntarios[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';

  constructor(private _voluntariosService: VoluntariosService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.voluntarios = [];
    this.errorMessage = '';
    this._voluntariosService.getAll().subscribe({
      next: (data) => this.voluntarios = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    });
  }

  eliminarVoluntario(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará al voluntario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._voluntariosService.delete(id).subscribe({
          next: () => {
            this.voluntarios = this.voluntarios.filter(v => v.voluntario_id !== id);
            Swal.fire(
              'Eliminado',
              'El voluntario ha sido eliminado correctamente.',
              'success'
            );
          },
          error: (e) => {
            console.error(e);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el voluntario.',
              'error'
            );
          }
        });
      }
    });
  }
}
