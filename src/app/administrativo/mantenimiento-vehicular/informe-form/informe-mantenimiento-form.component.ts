import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormCheckInputDirective, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, RowComponent, TableDirective } from '@coreui/angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, of } from 'rxjs';
import Swal from 'sweetalert2';

import { PersonalModel } from '../../../tthh/models/personal.model';
import { PersonalService } from '../../../tthh/services/personal.service';
import { colorEstadoMantenimiento, ConfiguracionMantenimiento, InformeMantenimientoModel, listaParametro, numeroInforme, OrdenMantenimientoModel, RUBROS_POR_DEFECTO, totalesRubroOrdenes } from '../../models/mantenimiento.model';
import { PdfService } from '../../../core/pdf.service';
import { MantenimientoService } from '../../services/mantenimiento.service';

@Component({
  selector: 'app-informe-mantenimiento-form',
  imports: [CommonModule, FormsModule, RouterLink, NgSelectComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormDirective, FormLabelDirective, FormControlDirective, FormCheckInputDirective, FormSelectDirective],
  templateUrl: './informe-mantenimiento-form.component.html'
})
export class InformeMantenimientoFormComponent implements OnInit {
  informe = new InformeMantenimientoModel();
  /** Órdenes que se pueden elegir: las ya incluidas + las que no están en ningún informe */
  disponibles: OrdenMantenimientoModel[] = [];
  seleccionadas = new Set<number>();
  personal: PersonalModel[] = [];
  configuracion: ConfiguracionMantenimiento | null = null;
  /** Texto para buscar órdenes por código, unidad, placa o número */
  filtro = '';
  validado = false;
  guardando = false;
  readonly color = colorEstadoMantenimiento;
  readonly numero = numeroInforme;

  constructor(private mantenimiento: MantenimientoService, private personalService: PersonalService, private pdf: PdfService,
              private route: ActivatedRoute, private router: Router) { }

  get esNuevo(): boolean { return !this.informe.informe_id; }
  get soloLectura(): boolean { return this.informe.informe_estado === 'ANULADO'; }
  /** Cargos posibles del responsable (parámetro MANT_CARGOS_RESPONSABLE) más el actual */
  get cargos(): string[] {
    const base = listaParametro(this.configuracion, 'MANT_CARGOS_RESPONSABLE', ['ADMINISTRADOR DE CONTRATO']);
    const actual = this.informe.tecnico_cargo;
    return actual && !base.includes(actual) ? [...base, actual] : base;
  }

  /** Órdenes visibles: las seleccionadas siempre, el resto según el filtro */
  get ordenesFiltradas(): OrdenMantenimientoModel[] {
    const t = this.filtro.trim().toLowerCase();
    if (!t) { return this.disponibles; }
    return this.disponibles.filter(o => this.seleccionadas.has(o.orden_id!) ||
      [o.orden_codigo, o.vehiculo_sigla, o.vehiculo_placa, numeroInforme(o.orden_serie), o.s_nombre].some(v => (v ?? '').toString().toLowerCase().includes(t)));
  }

  get totalesRubro() {
    return totalesRubroOrdenes(this.disponibles.filter(o => this.seleccionadas.has(o.orden_id!)), RUBROS_POR_DEFECTO);
  }
  get totalSeleccionado(): number {
    return this.disponibles.filter(o => this.seleccionadas.has(o.orden_id!)).reduce((t, o) => t + (Number(o.total_facturas) || 0), 0);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const informeId = id && id !== 'nuevo' ? Number(id) : null;
    forkJoin({
      personal: this.personalService.getAll(),
      configuracion: this.mantenimiento.getConfiguracion(),
      libres: this.mantenimiento.getOrdenes({ sin_informe: true }),
      informe: informeId ? this.mantenimiento.getInforme(informeId) : of(null),
    }).subscribe({
      next: ({ personal, configuracion, libres, informe }) => {
        this.personal = personal;
        this.configuracion = configuracion;
        const incluidas = informe?.ordenes_detalle ?? [];
        this.disponibles = [...incluidas, ...libres.filter(l => !incluidas.some(i => i.orden_id === l.orden_id))];
        if (informe) {
          this.informe = Object.assign(new InformeMantenimientoModel(), informe);
          incluidas.forEach(o => this.seleccionadas.add(o.orden_id!));
        } else {
          this.informe.director_administrativo = configuracion.director_administrativo?.ppersonal_id ?? null;
          this.informe.tecnico_cargo = this.cargos[0] ?? null;
        }
      },
      error: (e) => Swal.fire('Error', 'No se pudo cargar la información. ' + (e.error?.msg ?? e.message), 'error')
    });
  }

  /** Botón +1: siguiente número sugerido */
  siguienteNumero(): void {
    this.mantenimiento.getSiguienteNumeroInforme().subscribe({
      next: (r) => this.informe.informe_numero = r.informe_numero,
      error: (e) => Swal.fire('Error', e.error?.msg ?? e.message, 'error')
    });
  }

  imprimir(): void {
    if (this.informe.informe_id) { this.pdf.abrir(this.mantenimiento.urlReporteBitacora(this.informe.informe_id)); }
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
