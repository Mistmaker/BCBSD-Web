import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, ProgressComponent, RowComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { colorEstadoMantenimiento, ContratoMantenimientoModel } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';

/** Porcentaje usado (0-100) de un contrato o partida. */
export function porcentajeUsado(asignado: number | string | undefined, consumido: number | string | undefined): number {
  const a = Number(asignado) || 0;
  return a > 0 ? Math.min(100, Math.round((Number(consumido) || 0) / a * 1000) / 10) : 0;
}

@Component({
  selector: 'app-contratos-mantenimiento-lista',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, ProgressComponent],
  templateUrl: './contratos-mantenimiento-lista.component.html'
})
export class ContratosMantenimientoListaComponent implements OnInit {
  contratos: ContratoMantenimientoModel[] = [];
  filtro = '';
  readonly color = colorEstadoMantenimiento;
  readonly porcentaje = porcentajeUsado;

  constructor(private mantenimiento: MantenimientoService) { }

  ngOnInit(): void {
    this.mantenimiento.getContratos().subscribe({
      next: (d) => this.contratos = d,
      error: (e) => Swal.fire('Error', 'No se pudieron cargar los contratos. ' + (e.error?.msg ?? e.message), 'error')
    });
  }
}
