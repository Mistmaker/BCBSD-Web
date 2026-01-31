import { VehiculosModel } from './../../models/vehiculos.model';
import { VehiculosService } from './../../services/vehiculos.service';
import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

import {
  BadgeComponent,
  BorderDirective,
  ButtonDirective,
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
  TableDirective,
  InputGroupComponent,
  InputGroupTextDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../auth/auth.service';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { FormsModule } from '@angular/forms';

type CardColor = {
  color: string
  textColor?: string
}

@Component({
  selector: 'app-vehiculos-listado',
  imports: [BadgeComponent,CommonModule, IconDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective, FiltroGeneralPipe, InputGroupComponent, InputGroupTextDirective, FormsModule ],
  templateUrl: './vehiculos-listado.component.html',
  styleUrl: './vehiculos-listado.component.scss'
})
export class VehiculosListadoComponent implements OnInit {

  
  colors: CardColor[] = [
    { color: 'primary', textColor: 'primary' },
    { color: 'secondary', textColor: 'secondary' },
    { color: 'success', textColor: 'success' },
    { color: 'danger', textColor: 'danger' },
    { color: 'warning', textColor: 'warning' },
    { color: 'info', textColor: 'info' },
    { color: 'light' },
    { color: 'dark' }
  ];
  
  imgContext = { $implicit: 'top', bottom: 'bottom' };
  
  tabs = ['Active', 'List', 'Disabled']

  filtroBusqueda = '';
  vehiculos: VehiculosModel[] = [];
  errorMessage: string = '';
  page: number = 1;

  constructor(private _vehiculosService: VehiculosService, public authService: AuthService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.vehiculos = [];
    this.errorMessage = '';
    this._vehiculosService.getAll().subscribe({
      next: (data) => this.vehiculos = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }

}
