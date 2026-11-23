import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';

import { ButtonDirective, ButtonGroupComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';

import Swal from 'sweetalert2';
import { AphHojaRuta } from '../models/aph-hojaruta.model';
import { HojaRutaService } from '../services/aph/hoja-ruta.service';

@Component({
  selector: 'app-aph-hoja-ruta-listado',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, CommonModule,
    RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, ButtonGroupComponent, RouterLink,
    TableDirective, InputGroupComponent, InputGroupTextDirective, FiltroGeneralPipe],
  templateUrl: './aph-hoja-ruta-listado.component.html',
  styleUrl: './aph-hoja-ruta-listado.component.scss'
})
export class AphHojaRutaListadoComponent {

  hojasRuta: AphHojaRuta[] = [];

  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

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

  constructor(private _hojaRutaService: HojaRutaService ) { }
  
    ngOnInit(): void {
      this.cargarDatos();
    }
  
    cargarDatos() {
      this.hojasRuta = [];
      this.errorMessage = '';
      this._hojaRutaService.getAll().subscribe({
        next: (data) => this.hojasRuta = data,
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
        },
        complete: () => console.info('complete')
      })
    }

}
