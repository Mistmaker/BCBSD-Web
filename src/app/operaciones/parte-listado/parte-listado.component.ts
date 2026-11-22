import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { ParteService } from '../services/parte.service';
import { ParteModel } from '../models/partes.model';

@Component({
  selector: 'app-parte-listado',
  imports: [FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink,
    TableDirective, InputGroupComponent, InputGroupTextDirective],
  templateUrl: './parte-listado.component.html',
  styleUrl: './parte-listado.component.scss'
})
export class ParteListadoComponent {

  partes: ParteModel[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  constructor(private _parteService: ParteService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.partes = [];
    this.errorMessage = '';
    this._parteService.getAll().subscribe({
      next: (data) => this.partes = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }


}
