import { AfterViewInit, Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ColorModeService,
  FormControlDirective, FormLabelDirective, FormSelectDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import Swal from 'sweetalert2';
import * as L from 'leaflet';

import { coloresGrafico, nombreMes } from '../../administrativo/models/bitacora.model';
import { DIAS_SEMANA, formatoMinutos, graficoPorHora, graficoTop, opcionesConteo } from '../../operaciones/models/partes-estadisticas.model';
import { fechaISO } from '../../operaciones/models/partes.model';
import { ParteService } from '../../operaciones/services/parte.service';
import { colorTipo, Conteo, EstadisticasEmergencias, etiquetaConteo, graficoEmergenciasMes, indiceCritico, porcentaje, TipoEmergencia } from '../models/emergencias.model';
import { EmergenciasService } from '../services/emergencias.service';

/**
 * Panel de la Subjefatura (/sbj/dashboard, SBJ_ESTADISTICAS): estadística de emergencias a partir de los partes de
 * servicio, con pestañas Incendio y Auxilio y mapa de los puntos. Los recursos (vehículos, bomberos, herramientas)
 * están en el panel de Operaciones.
 */
@Component({
  selector: 'app-sbj-dashboard',
  imports: [CommonModule, FormsModule, ChartjsComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, ButtonGroupComponent, TableDirective, FormControlDirective, FormLabelDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './sbj-dashboard.component.html',
  styleUrl: './sbj-dashboard.component.scss'
})
export class SbjDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly servicio = inject(EmergenciasService);
  private readonly partes = inject(ParteService);
  private readonly colorMode = inject(ColorModeService).colorMode;

  filtro = { desde: `${new Date().getFullYear()}-01-01`, hasta: fechaISO(new Date()), estacion: null as number | null };
  estaciones: { estacion_id: number; estacion_nombre: string }[] = [];
  cargando = false;
  verTabla = false;
  readonly tipo = signal<TipoEmergencia>('INCENDIO');
  readonly datos = signal<EstadisticasEmergencias | null>(null);
  readonly dias = DIAS_SEMANA;
  readonly minutos = formatoMinutos;
  readonly nombreMes = nombreMes;
  readonly etiqueta = etiquetaConteo;
  readonly porcentaje = porcentaje;
  private mapa?: L.Map;
  private capa?: L.LayerGroup;

  private readonly colores = computed(() => {
    const m = this.colorMode();
    return coloresGrafico(m === 'dark' || (m === 'auto' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches));
  });
  /** Sección de la pestaña elegida */
  readonly seccion = computed(() => { const d = this.datos(); return d ? (this.tipo() === 'INCENDIO' ? d.incendio : d.auxilio) : null; });
  readonly colorSeccion = computed(() => colorTipo(this.tipo(), this.colores()));
  readonly gMes = computed(() => { const d = this.datos(); return d ? graficoEmergenciasMes(d.por_mes, this.colores()) : null; });
  readonly oMes = computed(() => opcionesConteo(this.colores(), { apilado: true }));
  readonly oTop = computed(() => opcionesConteo(this.colores(), { horizontal: true }));
  readonly oHora = computed(() => opcionesConteo(this.colores()));
  /** Bloques de la pestaña: título, explicación y conteos (incendio y auxilio tienen los suyos) */
  readonly bloques = computed(() => {
    const s = this.seccion();
    if (!s) return [];
    const propios: { titulo: string; nota: string; items: Conteo[] }[] = this.tipo() === 'INCENDIO'
      ? [{ titulo: 'Tipo de incendio', nota: 'Partes por tipo (un parte puede tener varios).', items: s.tipos_incendio ?? [] },
         { titulo: 'Naturaleza del lugar', nota: 'Vivienda, comercio, bosque...', items: s.naturalezas ?? [] }]
      : [{ titulo: 'Clasificación', nota: 'Tipo de auxilio del formato.', items: s.clasificaciones ?? [] },
         { titulo: 'Subclasificación y uso', nota: 'Detalle del tipo de auxilio (entre paréntesis, el uso).', items: s.subclasificaciones ?? [] }];
    return [...propios,
      { titulo: 'Posibles causas', nota: 'Entre paréntesis, la clasificación de la causa.', items: s.causas },
      { titulo: 'Parroquia', nota: 'Lugar de la emergencia.', items: s.por_parroquia },
      { titulo: 'Sector', nota: 'Los 15 sectores con más emergencias.', items: s.por_sector }];
  });
  readonly graficos = computed(() => this.bloques().map(b => graficoTop(b.items, etiquetaConteo, x => x.partes, this.colorSeccion())));
  readonly gHora = computed(() => {
    const s = this.seccion();
    if (!s) return null;
    const g = graficoPorHora(s.por_hora, this.colores());
    g.datasets[0].backgroundColor = this.colorSeccion();
    return g;
  });
  readonly horaCritica = computed(() => indiceCritico(this.seccion()?.por_hora ?? []));
  readonly diaCritico = computed(() => indiceCritico(this.seccion()?.por_dia_semana ?? []));
  readonly mesCritico = computed(() => {
    const d = this.datos();
    if (!d) return null;
    const i = indiceCritico(d.por_mes.map(m => this.tipo() === 'INCENDIO' ? m.incendio : m.auxilio));
    return i === null ? null : d.por_mes[i].mes;
  });
  readonly maxDia = computed(() => Math.max(1, ...(this.seccion()?.por_dia_semana ?? [])));

  constructor() {
    // El mapa se redibuja al cambiar los datos o la pestaña
    effect(() => this.dibujarPuntos());
  }

  ngOnInit(): void {
    this.partes.getCatalogos().subscribe({ next: (c) => this.estaciones = c.estaciones, error: () => this.estaciones = [] });
    this.consultar();
  }

  ngAfterViewInit(): void {
    if (!document.getElementById('mapa-emergencias')) return;
    this.mapa = L.map('mapa-emergencias').setView([-0.254, -79.172], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this.mapa);
    this.capa = L.layerGroup().addTo(this.mapa);
    this.dibujarPuntos();
  }

  ngOnDestroy(): void {
    this.mapa?.remove();
  }

  consultar(): void {
    this.cargando = true;
    this.servicio.getEstadisticas(this.filtro).subscribe({
      next: (d) => { this.datos.set(d); this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo calcular la estadística. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); },
    });
  }

  elegir(tipo: TipoEmergencia): void {
    this.tipo.set(tipo);
  }

  alto(n: number): number {
    return Math.max(120, Math.min(n, 10) * 30 + 40);
  }

  /** Puntos de la pestaña elegida en el mapa, con el color de su tipo */
  private dibujarPuntos(): void {
    const d = this.datos();
    const tipo = this.tipo();
    const color = this.colorSeccion();
    if (!this.mapa || !this.capa) return;
    this.capa.clearLayers();
    const puntos = (d?.puntos ?? []).filter(p => p.tipo === tipo);
    for (const p of puntos) {
      L.circleMarker([p.lat, p.lng], { radius: 6, color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 0.9 })
        .bindPopup(`<b>${p.numero}</b><br>${p.fecha}${p.detalle ? '<br>' + p.detalle.replace(/[<>&]/g, '') : ''}`)
        .addTo(this.capa);
    }
    if (puntos.length) {
      this.mapa.fitBounds(L.latLngBounds(puntos.map(p => [p.lat, p.lng] as L.LatLngTuple)), { maxZoom: 15, padding: [20, 20] });
    }
  }
}
