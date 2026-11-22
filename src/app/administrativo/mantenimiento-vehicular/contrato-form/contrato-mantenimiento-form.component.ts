import { AuthService } from '../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, ProgressComponent, RowComponent } from '@coreui/angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { PersonalModel } from '../../../tthh/models/personal.model';
import { PersonalService } from '../../../tthh/services/personal.service';
import {
  colorEstadoMantenimiento, ConfiguracionMantenimiento, ContratoMantenimientoModel, EstadoVehiculoModel, listaParametro, PartidaContratoModel,
  RUBROS_POR_DEFECTO, TIPOS_CONTRATO_POR_DEFECTO
} from '../../models/mantenimiento.model';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { porcentajeUsado } from '../contratos-lista/contratos-mantenimiento-lista.component';

@Component({
  selector: 'app-contrato-mantenimiento-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, NgLabelTemplateDirective, NgOptionTemplateDirective, RowComponent, ColComponent,
    CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, BadgeComponent, FormDirective, FormLabelDirective, FormControlDirective,
    FormSelectDirective, ProgressComponent],
  templateUrl: './contrato-mantenimiento-form.component.html'
})
export class ContratoMantenimientoFormComponent implements OnInit {
  contrato = new ContratoMantenimientoModel();
  personal: PersonalModel[] = [];
  vehiculos: EstadoVehiculoModel[] = [];
  configuracion: ConfiguracionMantenimiento | null = null;
  validado = false;
  guardando = false;
  readonly color = colorEstadoMantenimiento;
  readonly porcentaje = porcentajeUsado;

  constructor(public auth: AuthService, private mantenimiento: MantenimientoService, private personalService: PersonalService,
              private route: ActivatedRoute, private router: Router) { }

  get rubros(): string[] { return listaParametro(this.configuracion, 'MANT_RUBROS', RUBROS_POR_DEFECTO); }
  get tipos(): string[] { return listaParametro(this.configuracion, 'MANT_TIPOS_CONTRATO', TIPOS_CONTRATO_POR_DEFECTO); }
  get totalPartidas(): number {
    return Math.round(this.contrato.partidas.reduce((t, p) => t + (Number(p.partida_monto) || 0), 0) * 100) / 100;
  }
  get sinAsignar(): number { return Math.round(((Number(this.contrato.contrato_monto) || 0) - this.totalPartidas) * 100) / 100; }
  get rubrosLibres(): string[] { return this.rubros.filter(r => !this.contrato.partidas.some(p => p.partida_rubro === r)); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const contratoId = id && id !== 'nuevo' ? Number(id) : null;
    forkJoin({
      personal: this.personalService.getTodos(),
      vehiculos: this.mantenimiento.getEstadoVehiculos(),
      configuracion: this.mantenimiento.getConfiguracion(),
      contrato: contratoId ? this.mantenimiento.getContrato(contratoId) : of(null),
    }).subscribe({
      next: ({ personal, vehiculos, configuracion, contrato }) => {
        this.personal = personal;
        this.vehiculos = vehiculos;
        this.configuracion = configuracion;
        if (contrato) {
          this.contrato = Object.assign(new ContratoMantenimientoModel(), contrato, {
            contrato_monto: Number(contrato.contrato_monto),
            partidas: contrato.partidas.map(p => Object.assign(new PartidaContratoModel(), p, { partida_monto: Number(p.asignado ?? p.partida_monto) })),
            vehiculos: contrato.vehiculos.map(v => typeof v === 'number' ? v : Number(v.vehiculo_id)),
          });
        } else {
          // un contrato nuevo arranca con una partida por cada rubro configurado
          this.contrato.partidas = this.rubros.map(r => Object.assign(new PartidaContratoModel(), { partida_rubro: r }));
        }
      },
      error: (e) => Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.message), 'error')
    });
  }

  agregarPartida(): void {
    this.contrato.partidas.push(Object.assign(new PartidaContratoModel(), { partida_rubro: this.rubrosLibres[0] ?? '' }));
  }

  quitarPartida(i: number): void {
    const p = this.contrato.partidas[i];
    if (Number(p.consumido) > 0) {
      Swal.fire('Atención', `La partida ${p.partida_rubro} ya tiene valores consumidos y no se puede quitar.`, 'warning');
      return;
    }
    this.contrato.partidas.splice(i, 1);
  }

  /** Reparte el monto del contrato en partes iguales entre las partidas (ayuda inicial). */
  repartir(): void {
    const n = this.contrato.partidas.length;
    const monto = Number(this.contrato.contrato_monto) || 0;
    if (!n || !monto) { return; }
    const parte = Math.floor(monto / n * 100) / 100;
    this.contrato.partidas.forEach((p, i) => p.partida_monto = i === n - 1 ? Math.round((monto - parte * (n - 1)) * 100) / 100 : parte);
  }

  guardar(form: NgForm): void {
    this.validado = true;
    if (form.invalid) {
      Swal.fire('Atención', 'Revise los campos requeridos.', 'warning');
      return;
    }
    if (this.sinAsignar < 0) {
      Swal.fire('Atención', 'La suma de las partidas supera el monto del contrato.', 'warning');
      return;
    }
    const rubros = this.contrato.partidas.map(p => p.partida_rubro);
    if (new Set(rubros).size !== rubros.length) {
      Swal.fire('Atención', 'Hay rubros repetidos en las partidas.', 'warning');
      return;
    }
    if (this.guardando) { return; }
    this.guardando = true;
    this.mantenimiento.guardarContrato(this.contrato).subscribe({
      next: (r) => {
        this.guardando = false;
        Swal.fire('Listo', r.msg, 'success').then(() => this.router.navigate(['/admin/contratos-mantenimiento']));
      },
      error: (e) => {
        this.guardando = false;
        Swal.fire('Error', e.status === 409 ? 'Ya existe un contrato con ese código.' : (e.error?.msg ?? e.message), 'error');
      }
    });
  }
}
