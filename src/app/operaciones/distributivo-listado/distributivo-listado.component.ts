import { DistributivoModel } from './../models/distributivo.model';
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { DistributivoService } from '../services/distributivo.service';

@Component({
  selector: 'app-distributivo-listado',
  imports: [FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink,
    TableDirective, InputGroupComponent, InputGroupTextDirective],
  templateUrl: './distributivo-listado.component.html',
  styleUrl: './distributivo-listado.component.scss'
})
export class DistributivoListadoComponent {

  distributivos: DistributivoModel[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  constructor(private _distributivoService: DistributivoService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.distributivos = [];
    this.errorMessage = '';
    this._distributivoService.getAll().subscribe({
      next: (data) => this.distributivos = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }

}
