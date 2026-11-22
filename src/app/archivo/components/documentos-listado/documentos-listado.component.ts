import { ArchivoService } from './../../services/archivo.service';
import { Component, OnInit } from '@angular/core';
import { Documento } from '../../models/archivo.model';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TableDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';

import Swal from 'sweetalert2';
import { FiltroGeneralPipe } from 'src/app/pipes/filtro-general.pipe';


@Component({
  selector: 'app-documentos-listado',
  imports: [FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, RouterLink,
    TableDirective, InputGroupComponent, InputGroupTextDirective, FiltroGeneralPipe],
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