import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormSelectDirective,
  RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { AuthService } from '../../../auth/auth.service';
import { PdfService } from '../../../core/pdf.service';
import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { PeticionMaterialesModel, textoAutorizadoPara } from '../../models/peticion-materiales.model';
import { PeticionMaterialesService } from '../../services/peticion-materiales.service';

@Component({
  selector: 'app-peticiones-materiales-lista',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './peticiones-materiales-lista.component.html'
})
export class PeticionesMaterialesListaComponent implements OnInit {
  peticiones: PeticionMaterialesModel[] = [];
  anio: number | null = new Date().getFullYear();
  filtro = '';
  cargando = true;
  readonly textoAutorizadoPara = textoAutorizadoPara;
  readonly anios = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  constructor(public auth: AuthService, private servicio: PeticionMaterialesService, private pdf: PdfService) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.servicio.getAll(this.anio).subscribe({
      next: (d) => { this.peticiones = d; this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudieron cargar las peticiones. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }

  imprimir(p: PeticionMaterialesModel): void {
    this.pdf.abrir(this.servicio.urlPdf(p.peticion_id));
  }
}
