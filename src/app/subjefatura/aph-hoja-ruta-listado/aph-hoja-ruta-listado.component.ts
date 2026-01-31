import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';

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

import Swal from 'sweetalert2';
import { AphHojaRuta } from '../models/aph-hojaruta.model';
import { HojaRutaService } from '../services/aph/hoja-ruta.service';

@Component({
  selector: 'app-aph-hoja-ruta-listado',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FiltroGeneralPipe],
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
