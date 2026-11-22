import { AuthService } from '../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { colorEstadoMantenimiento, InformeMantenimientoModel } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { PdfService } from '../../../core/pdf.service';

@Component({
  selector: 'app-informes-mantenimiento-lista',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective],
  templateUrl: './informes-mantenimiento-lista.component.html'
})
export class InformesMantenimientoListaComponent implements OnInit {
  informes: (Omit<InformeMantenimientoModel, 'ordenes'> & { ordenes: number; total: number })[] = [];
  filtro = '';
  readonly color = colorEstadoMantenimiento;

  constructor(public auth: AuthService, private mantenimiento: MantenimientoService, private pdf: PdfService) { }

  imprimir(id: number): void {
    this.pdf.abrir(this.mantenimiento.urlReporteBitacora(id));
  }

  ngOnInit(): void {
    this.mantenimiento.getInformes().subscribe({
      next: (data) => this.informes = data as any,
      error: (e) => Swal.fire('Error', 'No se pudieron cargar los informes. ' + (e.error?.msg ?? e.message), 'error')
    });
  }
}
