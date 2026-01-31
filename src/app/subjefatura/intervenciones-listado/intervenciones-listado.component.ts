import { IntervencionesService } from './../services/intervenciones.service';
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
  TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective
} from '@coreui/angular';
import { IntervencionesModel } from '../models/estadisticas.model';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';

@Component({
  selector: 'app-intervenciones-listado',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FiltroGeneralPipe],
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
