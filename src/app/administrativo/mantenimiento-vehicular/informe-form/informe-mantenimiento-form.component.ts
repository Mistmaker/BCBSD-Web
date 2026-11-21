import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormCheckInputDirective, FormControlDirective, FormDirective, FormLabelDirective, RowComponent, TableDirective } from '@coreui/angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { PersonalModel } from '../../../tthh/models/personal.model';
import { PersonalService } from '../../../tthh/services/personal.service';
import { colorEstadoMantenimiento, InformeMantenimientoModel, OrdenMantenimientoModel } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';

@Component({
  selector: 'app-informe-mantenimiento-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormCheckInputDirective],
  templateUrl: './informe-mantenimiento-form.component.html'
})
export class InformeMantenimientoFormComponent implements OnInit {
  informe = new InformeMantenimientoModel();
  /** Órdenes que se pueden elegir: las ya incluidas + las que no están en ningún informe */
  disponibles: OrdenMantenimientoModel[] = [];
  seleccionadas = new Set<number>();
  personal: PersonalModel[] = [];
  validado = false;
  guardando = false;
  readonly color = colorEstadoMantenimiento;

  constructor(private mantenimiento: MantenimientoService, private personalService: PersonalService,
              private route: ActivatedRoute, private router: Router) { }

  get esNuevo(): boolean { return !this.informe.informe_id; }
  get soloLectura(): boolean { return this.informe.informe_estado === 'ANULADO'; }
  get totalSeleccionado(): number {
    return this.disponibles.filter(o => this.seleccionadas.has(o.orden_id!)).reduce((t, o) => t + (Number(o.total_facturas) || 0), 0);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const informeId = id && id !== 'nuevo' ? Number(id) : null;
    forkJoin({
      personal: this.personalService.getAll(),
      libres: this.mantenimiento.getOrdenes({ sin_informe: true }),
      informe: informeId ? this.mantenimiento.getInforme(informeId) : of(null),
    }).subscribe({
      next: ({ personal, libres, informe }) => {
        this.personal = personal;
        const incluidas = informe?.ordenes_detalle ?? [];
        this.disponibles = [...incluidas, ...libres.filter(l => !incluidas.some(i => i.orden_id === l.orden_id))];
        if (informe) {
          this.informe = Object.assign(new InformeMantenimientoModel(), informe);
          incluidas.forEach(o => this.seleccionadas.add(o.orden_id!));
        }
      },
      error: (e) => Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.message), 'error')
    });
  }

  alternar(ordenId: number): void {
    this.seleccionadas.has(ordenId) ? this.seleccionadas.delete(ordenId) : this.seleccionadas.add(ordenId);
  }

  guardar(form: NgForm, anular = false): void {
    this.validado = true;
    if (!anular && (form.invalid || this.seleccionadas.size === 0)) {
      Swal.fire('Atención', this.seleccionadas.size === 0 ? 'Seleccione al menos una orden de mantenimiento.' : 'Revise los campos requeridos.', 'warning');
      return;
    }
    if (this.guardando) { return; }
    const informe: InformeMantenimientoModel = {
      ...this.informe,
      ordenes: [...this.seleccionadas],
      informe_estado: anular ? 'ANULADO' : this.informe.informe_estado,
    };
    this.guardando = true;
    this.mantenimiento.guardarInforme(informe).subscribe({
      next: (r) => {
        this.guardando = false;
        Swal.fire('Listo', r.informe_numero ? `${r.msg}: ${r.informe_numero}` : r.msg, 'success')
          .then(() => this.router.navigate(['/admin/informes-mantenimiento']));
      },
      error: (e) => { this.guardando = false; Swal.fire('Error', e.error?.msg ?? e.message, 'error'); }
    });
  }

  anular(form: NgForm): void {
    Swal.fire({ title: 'Anular informe', text: 'Las órdenes quedarán libres para otro informe.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Anular', cancelButtonText: 'Cancelar' })
      .then(r => { if (r.isConfirmed) { this.guardar(form, true); } });
  }
}
