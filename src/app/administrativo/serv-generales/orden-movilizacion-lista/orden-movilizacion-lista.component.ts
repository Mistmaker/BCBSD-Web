import { AuthService } from '../../../auth/auth.service';
import { PdfService } from '../../../core/pdf.service';
// import { VehiculosModel } from './../../models/vehiculos.model';
// import { VehiculosService } from './../../services/vehiculos.service';
import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BadgeComponent, ButtonDirective, ButtonGroupComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective, TooltipDirective } from '@coreui/angular';
import { OrdenesMovilizacionModel } from '../../models/ordenes-movilizacion.model';
import { OrdenesMovilizacionService } from '../../services/ordenes-movilizacion.service';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';

@Component({
  selector: 'app-orden-movilizacion-lista',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent,
    CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, ButtonGroupComponent,
    RouterLink, TableDirective, InputGroupComponent, InputGroupTextDirective, FiltroGeneralPipe, TooltipDirective],
  templateUrl: './orden-movilizacion-lista.component.html',
  styleUrl: './orden-movilizacion-lista.component.scss'
})
export class OrdenMovilizacionListaComponent implements OnInit {

  ordenes: OrdenesMovilizacionModel[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  constructor(public auth: AuthService, private _pdfService: PdfService, private _ordenesMovilizacionService: OrdenesMovilizacionService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.ordenes = [];
    this.errorMessage = '';
    this._ordenesMovilizacionService.getAll().subscribe({
      next: (data) => this.ordenes = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }

  imprimir(id: number) {
    this._pdfService.abrir(this._ordenesMovilizacionService.imprimirOrden(id));
  }

}
