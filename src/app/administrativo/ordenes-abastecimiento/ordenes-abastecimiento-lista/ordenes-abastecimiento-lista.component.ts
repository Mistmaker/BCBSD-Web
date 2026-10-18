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
import { FiltroGeneralPipe } from 'src/app/pipes/filtro-general.pipe';
import { OrdenesAbastecimientoModel } from '../../models/ordenes-abastecimiento.model';
import { OrdenesAbastecimientoService } from '../../services/ordenes-abastecimiento.service';

@Component({
  selector: 'app-ordenes-abastecimiento-lista',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, IconDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FiltroGeneralPipe, TooltipDirective],
  templateUrl: './ordenes-abastecimiento-lista.component.html',
  styleUrl: './ordenes-abastecimiento-lista.component.scss'
})
export class OrdenesAbastecimientoListaComponent {
  ordenes: OrdenesAbastecimientoModel[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';
  page: number = 1;

  seleccionados: string[] = [];

  constructor(private _ordenesAbastecimientoService: OrdenesAbastecimientoService) { }
  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.ordenes = [];
    this.errorMessage = '';
    this._ordenesAbastecimientoService.getAll().subscribe({
      next: (data) => this.ordenes = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
      },
      complete: () => console.info('complete')
    })
  }

  imprimirVarios() {
    return this._ordenesAbastecimientoService.imprimirOrden(this.seleccionados);
  }

  imprimir(id: number) {
    return this._ordenesAbastecimientoService.imprimirOrden([id.toString()]);
  }

  seleccionarTodos(event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.ordenes.map((x) => this.toggle(x.orden_id.toString(), true));
    } else {
      this.seleccionados = [];
    }

  }

  toggle(id: string, checked: boolean) {
    this.seleccionados = checked
      ? [...this.seleccionados, id]
      : this.seleccionados.filter((x) => x !== id);
  }


get todosSeleccionados(): boolean {
  return this.ordenes.length > 0 && this.seleccionados.length === this.ordenes.length;
}

get algunosSeleccionados(): boolean {
  return this.seleccionados.length > 0 && !this.todosSeleccionados;
}

toggleTodos(checked: boolean) {
  this.seleccionados = checked ? this.ordenes.map((o) => o.orden_id) : [];
}
}
