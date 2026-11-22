import { AuthService } from '../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, RowComponent } from '@coreui/angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { EstadoVehiculoModel, PlanMantenimientoModel, RecursoMantenimientoModel, ReglaMantenimientoModel } from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';

/** Primeros puntos de mantenimiento de una regla, para mostrar una vista previa. */
export function puntosRegla(inicio: number | null, intervalo: number | null, cantidad = 4): number[] {
  const i = Number(inicio) || 0;
  const n = Number(intervalo);
  if (!n || n <= 0) { return []; }
  return Array.from({ length: cantidad }, (_, k) => i + k * n);
}

@Component({
  selector: 'app-plan-mantenimiento-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, FormDirective, FormLabelDirective, FormControlDirective, FormSelectDirective],
  templateUrl: './plan-mantenimiento-form.component.html'
})
export class PlanMantenimientoFormComponent implements OnInit {
  plan = new PlanMantenimientoModel();
  recursos: RecursoMantenimientoModel[] = [];
  /** Todas las unidades activas (incluye las que no tienen custodio asignado) */
  vehiculos: EstadoVehiculoModel[] = [];
  validado = false;
  guardando = false;
  readonly puntos = puntosRegla;

  constructor(public auth: AuthService, private mantenimiento: MantenimientoService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const planId = id && id !== 'nuevo' ? Number(id) : null;
    forkJoin({
      recursos: this.mantenimiento.getRecursos(),
      vehiculos: this.mantenimiento.getEstadoVehiculos(),
      plan: planId ? this.mantenimiento.getPlan(planId) : of(null),
    }).subscribe({
      next: ({ recursos, vehiculos, plan }) => {
        this.recursos = recursos;
        this.vehiculos = vehiculos;
        if (plan) {
          this.plan = Object.assign(new PlanMantenimientoModel(), plan, {
            // en el formulario se trabaja con ids
            reglas: plan.reglas.map(r => Object.assign(new ReglaMantenimientoModel(), r, {
              recursos: r.recursos.map(x => typeof x === 'number' ? x : Number(x.recurso_id))
            })),
            vehiculos: plan.vehiculos.map(v => typeof v === 'number' ? v : Number(v.vehiculo_id)),
          });
        } else {
          this.agregarRegla();
        }
      },
      error: (e) => Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.message), 'error')
    });
  }

  agregarRegla(): void { this.plan.reglas.push(new ReglaMantenimientoModel()); }
  quitarRegla(i: number): void { this.plan.reglas.splice(i, 1); }

  guardar(form: NgForm): void {
    this.validado = true;
    const reglasInvalidas = this.plan.reglas.some(r => !r.mantenimiento_km_intervalo || r.mantenimiento_km_intervalo <= 0);
    if (form.invalid || !this.plan.reglas.length || reglasInvalidas) {
      Swal.fire('Atención', 'Ingrese el modelo y al menos una regla con un intervalo mayor a 0.', 'warning');
      return;
    }
    if (this.guardando) { return; }
    this.guardando = true;
    this.mantenimiento.guardarPlan(this.plan).subscribe({
      next: (r) => {
        this.guardando = false;
        Swal.fire('Listo', r.msg, 'success').then(() => this.router.navigate(['/admin/planes-mantenimiento']));
      },
      error: (e) => {
        this.guardando = false;
        Swal.fire('Error', e.status === 409 ? 'Ya existe un plan para ese modelo.' : (e.error?.msg ?? e.message), 'error');
      }
    });
  }
}
