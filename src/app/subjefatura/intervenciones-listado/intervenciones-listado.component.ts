import { IntervencionesService } from './../services/intervenciones.service';
import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonDirective, ButtonGroupComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { IntervencionesModel } from '../models/estadisticas.model';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';

@Component({
  selector: 'app-intervenciones-listado',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, CommonModule,
    RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, ButtonGroupComponent, RouterLink,
    TableDirective, InputGroupComponent, InputGroupTextDirective, FiltroGeneralPipe],
  templateUrl: './intervenciones-listado.component.html',
  styleUrl: './intervenciones-listado.component.scss'
})
export class IntervencionesListadoComponent implements OnInit {

  intervenciones: IntervencionesModel[] =[];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  constructor(private _intervencionesService: IntervencionesService ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.intervenciones = [];
    this.errorMessage = '';
    this._intervencionesService.getAll().subscribe({
      next: (data) => this.intervenciones = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }

}
