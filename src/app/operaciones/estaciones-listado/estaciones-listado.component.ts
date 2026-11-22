import { EstacionesModel } from './../models/estaciones.model';
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { EstacionesService } from '../services/estaciones.service';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';

@Component({
  selector: 'app-estaciones-listado',
  imports: [FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink,
    TableDirective, InputGroupComponent, InputGroupTextDirective, FiltroGeneralPipe],
  templateUrl: './estaciones-listado.component.html',
  styleUrl: './estaciones-listado.component.scss'
})
export class EstacionesListadoComponent {

  estaciones: EstacionesModel[] = [];
    filtroBusqueda = '';
    errorMessage: string = '';
    page: number = 1;
  
    constructor(private _estacionesService: EstacionesService) { }
  
    ngOnInit(): void {
      this.cargarDatos();
    }
  
    cargarDatos() {
      this.estaciones = [];
      this.errorMessage = '';
      this._estacionesService.getAll().subscribe({
        next: (data) => this.estaciones = data,
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
        },
        complete: () => console.info('complete')
      })
    }
}
