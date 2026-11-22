import { AuthService } from '../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, RowComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { FiltroGeneralPipe } from '../../../pipes/filtro-general.pipe';
import { PlanResumenModel, RecursoMantenimientoModel } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';

@Component({
  selector: 'app-planes-mantenimiento-lista',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective],
  templateUrl: './planes-mantenimiento-lista.component.html'
})
export class PlanesMantenimientoListaComponent implements OnInit {
  planes: PlanResumenModel[] = [];
  recursos: RecursoMantenimientoModel[] = [];
  filtroRecursos = '';
  /** Recurso en edición (nuevo o existente) */
  recurso: RecursoMantenimientoModel | null = null;

  constructor(public auth: AuthService, private mantenimiento: MantenimientoService) { }

  ngOnInit(): void {
    this.mantenimiento.getPlanes().subscribe({
      next: (d) => this.planes = d,
      error: (e) => Swal.fire('Error', 'No se pudieron cargar los planes. ' + (e.error?.msg ?? e.message), 'error')
    });
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    this.mantenimiento.getRecursos().subscribe({ next: (d) => this.recursos = d, error: (e) => console.error(e) });
  }

  editarRecurso(r?: RecursoMantenimientoModel): void {
    this.recurso = r ? { ...r } : new RecursoMantenimientoModel();
  }

  guardarRecurso(): void {
    if (!this.recurso || !this.recurso.recurso_descripcion.trim()) {
      Swal.fire('Atención', 'Ingrese la descripción del recurso.', 'warning');
      return;
    }
    this.mantenimiento.guardarRecurso(this.recurso).subscribe({
      next: () => { this.recurso = null; this.cargarRecursos(); },
      error: (e) => Swal.fire('Error', e.status === 409 ? 'Ya existe un recurso con ese código o descripción.' : (e.error?.msg ?? e.message), 'error')
    });
  }
}
