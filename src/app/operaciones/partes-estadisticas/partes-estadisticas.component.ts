import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ColorModeService,
  FormControlDirective, FormLabelDirective, FormSelectDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import Swal from 'sweetalert2';

import { coloresGrafico, nombreMes } from '../../administrativo/models/bitacora.model';
import { CatalogosParte, fechaISO, TIPOS_PARTE } from '../models/partes.model';
import { DIAS_SEMANA, EstadisticasPartes, formatoMinutos, graficoPartesMes, graficoPorHora, graficoTop, nombreVehiculoParte, opcionesConteo,
  TIPO_RECURSO } from '../models/partes-estadisticas.model';
import { FiltroPartes, ParteService } from '../services/parte.service';
import { AuthService } from '../../auth/auth.service';

type Vista = 'grafico' | 'tabla';

/**
 * Estadística de partes de servicio (/operaciones/partes-estadisticas, OPE_PARTES_ESTADISTICAS):
 * emergencias por mes, estación, vehículo, bombero, herramientas/recursos, tipo de auxilio, causa y hora del aviso.
 */
@Component({
  selector: 'app-partes-estadisticas',
  imports: [CommonModule, FormsModule, RouterLink, ChartjsComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, ButtonGroupComponent, TableDirective, FormControlDirective, FormLabelDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './partes-estadisticas.component.html',
  styles: [`
    .kpi { font-size: 1.6rem; font-weight: 600; line-height: 1.15; }
    .grafico { position: relative; height: 280px; }
    .grafico-alto { position: relative; height: 340px; }
    .tabla-scroll { max-height: 340px; overflow: auto; }
  `]
})
export class PartesEstadisticasComponent implements OnInit {
  private readonly servicio = inject(ParteService);
  private readonly auth = inject(AuthService);
  private readonly colorMode = inject(ColorModeService).colorMode;

  filtro: FiltroPartes = { desde: `${new Date().getFullYear()}-01-01`, hasta: fechaISO(new Date()), estacion: null, tipo: '' };
  estaciones: CatalogosParte['estaciones'] = [];
  cargando = false;
  /** Vista por sección: gráfico o tabla */
  vista: Record<string, Vista> = { mes: 'grafico', vehiculo: 'grafico', bombero: 'grafico', recurso: 'grafico', auxilio: 'grafico', hora: 'grafico' };
  tipoRecurso: '' | 'EQUIPO' | 'MATERIAL' | 'INSUMO' = 'EQUIPO';
  readonly datos = signal<EstadisticasPartes | null>(null);
  readonly tipos = TIPOS_PARTE;
  readonly dias = DIAS_SEMANA;
  readonly tipoRecursoTexto = TIPO_RECURSO;
  readonly nombreMes = nombreMes;
  readonly minutos = formatoMinutos;
  readonly nombreVehiculo = nombreVehiculoParte;
  readonly verBitacora = this.auth.tienePermiso('ADM_BITACORA_VEHICULOS');

  private readonly colores = computed(() => {
    const m = this.colorMode();
    return coloresGrafico(m === 'dark' || (m === 'auto' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches));
  });
  private readonly tipoRecursoSel = signal<string>('EQUIPO');
  readonly recursos = computed(() => (this.datos()?.por_recurso ?? []).filter(r => !this.tipoRecursoSel() || r.tipo === this.tipoRecursoSel()));

  readonly gMes = computed(() => { const d = this.datos(); return d ? graficoPartesMes(d.por_mes, this.colores()) : null; });
  readonly gVehiculo = computed(() => { const d = this.datos(); return d ? graficoTop(d.por_vehiculo, nombreVehiculoParte, v => v.salidas, this.colores().series[0]) : null; });
  readonly gBombero = computed(() => { const d = this.datos(); return d ? graficoTop(d.por_bombero, b => b.nombre, b => b.participaciones, this.colores().series[0]) : null; });
  readonly gRecurso = computed(() => graficoTop(this.recursos(), r => r.descripcion, r => r.partes, this.colores().series[0]));
  readonly gAuxilio = computed(() => {
    const d = this.datos();
    return d ? graficoTop(d.por_tipo_auxilio, t => [t.clasificacion, t.subclasificacion].filter(Boolean).join(' / '), t => t.partes, this.colores().series[0]) : null;
  });
  readonly gHora = computed(() => { const d = this.datos(); return d ? graficoPorHora(d.por_hora, this.colores()) : null; });
  readonly oMes = computed(() => opcionesConteo(this.colores(), { apilado: true }));
  readonly oTop = computed(() => opcionesConteo(this.colores(), { horizontal: true }));
  readonly oTopSalidas = computed(() => opcionesConteo(this.colores(), { horizontal: true, unidad: 'salidas' }));
  readonly oHora = computed(() => opcionesConteo(this.colores()));
  readonly maxDia = computed(() => Math.max(1, ...(this.datos()?.por_dia_semana ?? [])));

  ngOnInit(): void {
    this.servicio.getCatalogos().subscribe({ next: (c) => this.estaciones = c.estaciones, error: () => this.estaciones = [] });
    this.consultar();
  }

  consultar(): void {
    this.cargando = true;
    this.servicio.getEstadisticas(this.filtro).subscribe({
      next: (d) => { this.datos.set(d); this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo calcular la estadística. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); },
    });
  }

  elegirTipoRecurso(t: '' | 'EQUIPO' | 'MATERIAL' | 'INSUMO'): void {
    this.tipoRecurso = t;
    this.tipoRecursoSel.set(t);
  }

  /** Alto del gráfico horizontal según la cantidad de barras (máx. 10) */
  alto(n: number): number {
    return Math.max(120, Math.min(n, 10) * 30 + 40);
  }
}
