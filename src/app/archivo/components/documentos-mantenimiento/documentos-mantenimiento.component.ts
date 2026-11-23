import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { Documento, Direccion, TipoDocumento } from '../../models/archivo.model';

import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent, InputGroupComponent, InputGroupTextDirective, FormSelectDirective } from '@coreui/angular';

import Swal from 'sweetalert2';
import { ArchivoService } from '../../services/archivo.service';

@Component({
  selector: 'app-documentos-mantenimiento',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, RouterLink, TextColorDirective, FormDirective, FormLabelDirective, FormControlDirective, FormFeedbackComponent,
    InputGroupComponent, InputGroupTextDirective, FormSelectDirective],
  templateUrl: './documentos-mantenimiento.component.html',
  styleUrls: ['./documentos-mantenimiento.component.scss']
})
export class DocumentosMantenimientoComponent implements OnInit {

  documento: Documento = new Documento();
  direcciones: Direccion[] = [];
  tiposDocumento: TipoDocumento[] = [];
  errorMessage: string = '';
  customStylesValidated = false;

  constructor(
    private _archivoService: ArchivoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const routeStr = this.route.snapshot.paramMap.get('id');
    if (routeStr !== 'nuevo' && routeStr !== null) {
      // Cargar documento existente
      this._archivoService.getById(+routeStr).subscribe({
        next: (data) => {
          this.documento = data;
        },
        error: (e) => {
          console.error(e);
          Swal.fire('Error', 'Error al obtener el registro. ' + e.message, 'error');
        },
        complete: () => console.info('complete')
      });
    }

    // Cargar direcciones
    this._archivoService.getDirecciones().subscribe({
      next: (data) => {
        this.direcciones = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener las direcciones. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });

    // Cargar tipos de documento
    this._archivoService.getTiposDocumento().subscribe({
      next: (data) => {
        this.tiposDocumento = data;
      },
      error: (e) => {
        console.error(e);
        Swal.fire('Error', 'Error al obtener los tipos de documento. ' + e.message, 'error');
      },
      complete: () => console.info('complete')
    });
  }

  onSubmit(form: NgForm) {
    this.customStylesValidated = true;
    if (form.invalid) {
      Swal.fire('Atención', 'Algunos campos están incorrectos o vacíos, por favor revise e intente nuevamente.', 'warning');
      return;
    }

    if (this.documento.documento_id) {
      // Actualizar documento
      this._archivoService.update(this.documento).subscribe({
        next: () => {
          Swal.fire('Listo', 'El documento ha sido actualizado correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al actualizar el documento.', 'error');
        }
      });
    } else {
      // Crear nuevo documento
      this._archivoService.save(this.documento).subscribe({
        next: () => {
          Swal.fire('Listo', 'El documento ha sido registrado correctamente.', 'success');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (e) => {
          console.error(e);
          this.errorMessage = e.message;
          Swal.fire('Error', 'Hubo un problema al registrar el documento.', 'error');
        }
      });
    }
  }

  onReset() {
    this.customStylesValidated = false;
    this.documento = new Documento();
  }
}