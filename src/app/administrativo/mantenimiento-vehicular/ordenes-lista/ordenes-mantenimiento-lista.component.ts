import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormSelectDirective, RowComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { colorEstadoMantenimiento, EstadoVehiculoModel, OrdenMantenimientoModel } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';

@Component({
  selector: 'app-ordenes-mantenimiento-lista',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, FormSelectDirective],
  templateUrl: './ordenes-mantenimiento-lista.component.html'
})
export class OrdenesMantenimientoListaComponent implements OnInit {
  vista: 'ordenes' | 'flota' = 'ordenes';
  ordenes: OrdenMantenimientoModel[] = [];
  flota: EstadoVehiculoModel[] = [];
  filtro = '';
  filtroEstadoFlota = '';
  cargando = false;
  readonly color = colorEstadoMantenimiento;

  constructor(private mantenimiento: MantenimientoService, private router: Router) { }

  ngOnInit(): void {
    this.cargando = true;
    this.mantenimiento.getOrdenes().subscribe({
      next: (data) => { this.ordenes = data; this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudieron cargar las órdenes. ' + (e.error?.msg ?? e.message), 'error'); }
    });
    this.mantenimiento.getEstadoVehiculos().subscribe({
      next: (data) => this.flota = data,
      error: (e) => console.error(e)
    });
  }

  /** Vehículos que requieren atención (vencidos o próximos). */
  get alertas(): EstadoVehiculoModel[] {
    return this.flota.filter(v => v.estado_mantenimiento === 'VENCIDO' || v.estado_mantenimiento === 'PROXIMO');
  }

  get flotaFiltrada(): EstadoVehiculoModel[] {
    return this.filtroEstadoFlota ? this.flota.filter(v => v.estado_mantenimiento === this.filtroEstadoFlota) : this.flota;
  }

  crearOrden(vehiculo: EstadoVehiculoModel): void {
    this.router.navigate(['/admin/ordenes-mantenimiento/nuevo'], {
      queryParams: { vehiculo: vehiculo.vehiculo_id, tipo: vehiculo.proximo ? 'PREVENTIVO' : 'CORRECTIVO' }
    });
  }
}
