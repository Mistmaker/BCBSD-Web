import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertComponent, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ColorModeService,
  FormControlDirective, FormLabelDirective, RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import Swal from 'sweetalert2';

import {
  coloresGrafico, colorAlerta, etiquetaSerie, EventoBitacora, filtrarEventos, graficoGasto, graficoRendimiento, nombreMes, nombreVehiculo, opcionesGrafico,
  rangoPorDefecto, RespuestaVehiculo, TipoEvento, TIPOS_EVENTO
} from '../../models/bitacora.model';
import { BitacoraService } from '../../services/bitacora.service';

@Component({
  selector: 'app-bitacora-vehiculo',
  imports: [CommonModule, FormsModule, RouterLink, ChartjsComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective,
    ButtonGroupComponent, TableDirective, FormControlDirective, FormLabelDirective, SpinnerComponent, AlertComponent],
  templateUrl: './bitacora-vehiculo.component.html',
  styles: [`
    .kpi { font-size: 1.5rem; font-weight: 600; line-height: 1.2; }
    .grafico { position: relative; height: 280px; }
    .leyenda-color { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; vertical-align: baseline; }
  `]
})
export class BitacoraVehiculoComponent implements OnInit {
  private readonly colorMode = inject(ColorModeService).colorMode;
  private readonly bitacora = inject(BitacoraService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  id = 0;
  desde = rangoPorDefecto().desde;
  hasta = rangoPorDefecto().hasta;
  cargando = false;
  /** Ya se hizo la primera consulta: las siguientes vienen del formulario */
  private consultado = false;
  verTablaGasto = false;
  readonly datos = signal<RespuestaVehiculo | null>(null);
  readonly tiposVisibles = signal(new Set<TipoEvento>(TIPOS_EVENTO.map(t => t.tipo)));
  readonly tipos = TIPOS_EVENTO;
  readonly colorAlerta = colorAlerta;
  readonly nombreMes = nombreMes;
  readonly etiquetaSerie = etiquetaSerie;
  readonly nombreVehiculo = nombreVehiculo;

  private readonly oscuro = computed(() => {
    const modo = this.colorMode();
    return modo === 'dark' || (modo === 'auto' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches);
  });
  readonly colores = computed(() => coloresGrafico(this.oscuro()));
  readonly graficoRend = computed(() => {
    const d = this.datos();
    return d ? graficoRendimiento(d.tramos, d.comparacion.rendimiento.promedio_pares, this.colores()) : null;
  });
  readonly opcionesRend = computed(() => opcionesGrafico(this.colores(), 'km/gal'));
  readonly graficoGasto = computed(() => {
    const d = this.datos();
    return d ? graficoGasto(d.gasto_mensual, d.rubros, this.colores()) : null;
  });
  readonly opcionesGasto = computed(() => opcionesGrafico(this.colores(), 'USD', true));
  readonly seriesGasto = computed(() => ['COMBUSTIBLE', ...(this.datos()?.rubros ?? [])]);
  readonly eventos = computed<EventoBitacora[]>(() => filtrarEventos(this.datos()?.eventos ?? [], this.tiposVisibles()));
  readonly conteoTipos = computed(() => {
    const c: Partial<Record<TipoEvento, number>> = {};
    for (const e of this.datos()?.eventos ?? []) { c[e.tipo] = (c[e.tipo] ?? 0) + 1; }
    return c;
  });
  readonly tramosInvalidos = computed(() => (this.datos()?.tramos ?? []).filter(t => !t.valido));

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.desde = q.get('desde') ?? this.desde;
    this.hasta = q.get('hasta') ?? this.hasta;
    // el enlace a un vehículo igual reutiliza el componente: recargar cuando cambia el id
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => {
      this.id = Number(p.get('id'));
      this.consultar();
    });
  }

  consultar(): void {
    if (!this.desde || !this.hasta || this.desde > this.hasta) {
      Swal.fire('Fechas', 'Seleccione un rango válido: la fecha inicial no puede ser posterior a la final.', 'warning');
      return;
    }
    // Solo si el usuario cambió las fechas (al abrir sin fechas en la URL se usan las por defecto sin reescribirla:
    // hacerlo inicia una transición de vista que interrumpe la de la navegación)
    const q = this.route.snapshot.queryParamMap;
    const enUrl = q.get('desde') !== null;
    if ((enUrl || this.consultado) && (q.get('desde') !== this.desde || q.get('hasta') !== this.hasta)) {
      this.router.navigate([], { queryParams: { desde: this.desde, hasta: this.hasta }, replaceUrl: true });
    }
    this.consultado = true;
    this.cargando = true;
    this.bitacora.getVehiculo(this.id, this.desde, this.hasta).subscribe({
      next: (r) => { this.datos.set(r); this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudo cargar la bitácora. ' + (e.error?.msg ?? e.error?.error ?? e.message), 'error'); }
    });
  }

  alternarTipo(tipo: TipoEvento): void {
    const s = new Set(this.tiposVisibles());
    if (s.has(tipo)) { s.delete(tipo); } else { s.add(tipo); }
    this.tiposVisibles.set(s);
  }

  etiquetaTipo(tipo: TipoEvento): string {
    return this.tipos.find(t => t.tipo === tipo)?.etiqueta ?? tipo;
  }

  icono(tipo: TipoEvento): string {
    return this.tipos.find(t => t.tipo === tipo)?.icono ?? 'fa-circle';
  }

  rubros(e: EventoBitacora): { rubro: string; valor: number }[] {
    return Object.entries(e.rubros ?? {}).map(([rubro, valor]) => ({ rubro, valor }));
  }

  valorSerie(fila: Record<string, number | string>, serie: string): number {
    return Number(fila[serie] ?? 0);
  }

  totalSerie(serie: string): number {
    return (this.datos()?.gasto_mensual ?? []).reduce((s, m) => s + Number(m[serie] ?? 0), 0);
  }

  totalGasto(): number {
    return (this.datos()?.gasto_mensual ?? []).reduce((s, m) => s + m.total, 0);
  }
}
