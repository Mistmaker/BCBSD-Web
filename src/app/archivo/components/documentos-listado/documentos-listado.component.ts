import { ArchivoService } from './../../services/archivo.service';
import { Component, OnInit } from '@angular/core';
import { Documento } from '../../models/archivo.model';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
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

import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from 'src/app/pipes/filtro-general.pipe';


@Component({
  selector: 'app-documentos-listado',
  imports: [FormsModule, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, BadgeComponent, CommonModule, IconDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, NgTemplateOutlet, CardTitleDirective, CardTextDirective, ButtonDirective, ButtonGroupComponent, CardSubtitleDirective, CardLinkDirective, RouterLink, ListGroupDirective, ListGroupItemDirective, CardFooterComponent, BorderDirective, CardGroupComponent, GutterDirective, CardImgDirective, TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent, TableDirective,FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FiltroGeneralPipe, TooltipDirective],
  templateUrl: './documentos-listado.component.html',
  styleUrls: ['./documentos-listado.component.scss']
})
export class DocumentosListadoComponent implements OnInit {

  documentos: Documento[] = [];
  filtroBusqueda = '';
  errorMessage: string = '';

  constructor(private _archivoService: ArchivoService) { }

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  cargarDocumentos() {
    this.documentos = [];
    this.errorMessage = '';
    this._archivoService.getAll().subscribe({
      next: (data) => this.documentos = data,
      error: (e) => {
        console.error(e);
        this.errorMessage = e.message;
        Swal.fire('Error', 'Hubo un problema al cargar los documentos.', 'error');
      },
      complete: () => console.info('Documentos cargados correctamente.')
    });
  }

  eliminarDocumento(id: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará el documento de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._archivoService.delete(id).subscribe({
          next: () => {
            this.documentos = this.documentos.filter(d => d.documento_id !== id);
            Swal.fire('Eliminado', 'El documento ha sido eliminado correctamente.', 'success');
          },
          error: (e) => {
            console.error(e);
            Swal.fire('Error', 'Hubo un problema al eliminar el documento.', 'error');
          }
        });
      }
    });
  }
}