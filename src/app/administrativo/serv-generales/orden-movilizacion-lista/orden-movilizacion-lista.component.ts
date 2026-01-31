// import { VehiculosModel } from './../../models/vehiculos.model';
// import { VehiculosService } from './../../services/vehiculos.service';
import { Component, OnInit } from '@angular/core';

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
  TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,TooltipDirective 
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { OrdenesMovilizacionModel } from '../../models/ordenes-movilizacion.model';
import { OrdenesMovilizacionService } from '../../services/ordenes-movilizacion.service';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';

@Component({
  selector: 'app-orden-movilizacion-lista',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, IconDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FiltroGeneralPipe, TooltipDirective],
  templateUrl: './orden-movilizacion-lista.component.html',
  styleUrl: './orden-movilizacion-lista.component.scss'
})
export class OrdenMovilizacionListaComponent implements OnInit {

  ordenes: OrdenesMovilizacionModel[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  constructor(private _ordenesMovilizacionService: OrdenesMovilizacionService) { }

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
    return this._ordenesMovilizacionService.imprimirOrden(id);
  }

}
