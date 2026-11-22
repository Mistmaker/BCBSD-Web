/** Bitácora del vehículo: tipos de la respuesta del API y funciones para tablas y gráficos. */
import type { ChartData, ChartOptions } from 'chart.js';

export type NivelAlerta = 'serious' | 'warning';
export type TipoEvento = 'COMBUSTIBLE' | 'MANTENIMIENTO' | 'MOVILIZACION' | 'EMERGENCIA';

export interface AlertaBitacora { tipo: string; nivel: NivelAlerta; mensaje: string; }

export interface VehiculoBitacora {
  vehiculo_id: number; vehiculo_sigla: string | null; vehiculo_placa: string; vehiculo_marca: string | null; vehiculo_modelo: string | null;
  vehiculo_anio: number | null; vehiculo_tipo: string; vehiculo_combustible: string; vehiculo_estado: string | null;
  vehiculo_chasis?: string | null; vehiculo_motor?: string | null;
}

export interface FilaFlotaBitacora extends VehiculoBitacora {
  km_recorridos: number; km_actual: number | null; cargas: number; galones: number; gasto_combustible: number;
  rendimiento: number | null; costo_km_combustible: number | null; mantenimientos: number; gasto_mantenimiento: number;
  gasto_por_rubro: Record<string, number>; km_entre_mantenimientos: number | null; dias_entre_mantenimientos: number | null;
  costo_mant_km: number | null; costo_total: number; costo_total_km: number | null;
  pares: number; rendimiento_pares: number | null; rendimiento_dif_pct: number | null;
  costo_mant_km_pares: number | null; costo_mant_dif_pct: number | null; alertas: AlertaBitacora[];
}

export interface ParametrosBitacora { ventana: number; pct_rendimiento: number; pct_costo: number; }

export interface RespuestaFlota { desde: string; hasta: string; parametros: ParametrosBitacora; vehiculos: FilaFlotaBitacora[]; }

export interface TramoCombustible {
  carga_id: number; codigo: string; fecha: string; km: number | null; km_recorridos: number | null; galones: number; valor: number;
  dias: number | null; rendimiento: number | null; costo_km: number | null; valido: boolean; motivo: string | null; incluye_cargas_sin_lectura: boolean;
}

export interface TrabajoRepetido {
  trabajo: string; clave: string; veces: number; dias_min: number; km_min: number; en_ventana: boolean;
  ocurrencias: { codigo: string; fecha: string; km: number; texto: string }[];
}

export interface IndicadoresBitacora {
  km_recorridos: number; km_actual: number | null;
  combustible: { cargas: number; galones: number; valor: number; precio_galon: number | null; km_tramos: number; rendimiento: number | null;
                 costo_km: number | null; dias_entre_cargas: number | null; inconsistencias: number; };
  mantenimiento: { ordenes: number; por_tipo: Record<string, number>; total: number; por_rubro: Record<string, number>;
                   km_entre: number | null; dias_entre: number | null; };
  costo_mant_km: number | null; costo_total: number; costo_total_km: number | null; trabajos_repetidos: TrabajoRepetido[];
}

export interface Comparacion { valor: number | null; promedio_pares: number | null; pares_con_dato: number; diferencia_pct: number | null; }

export interface ParBitacora extends VehiculoBitacora {
  km_recorridos: number; rendimiento: number | null; costo_km_combustible: number | null; gasto_mantenimiento: number;
  costo_mant_km: number | null; costo_total_km: number | null;
}

export interface EventoBitacora {
  tipo: TipoEvento; id: number; codigo: string; fecha: string; km: number | null; km_fin?: number | null; detalle: string;
  galones?: number; valor?: number; km_desde_anterior?: number | null; rendimiento?: number | null; observacion?: string | null;
  rubros?: Record<string, number>; trabajos?: string[]; sugeridos?: string[];
}

export type GastoMes = { mes: string; total: number } & Record<string, number | string>;

export interface RespuestaVehiculo {
  desde: string; hasta: string; parametros: ParametrosBitacora; rubros: string[];
  vehiculo: VehiculoBitacora; indicadores: IndicadoresBitacora; tramos: TramoCombustible[]; gasto_mensual: GastoMes[];
  comparacion: { rendimiento: Comparacion; costo_mant_km: Comparacion; costo_total_km: Comparacion };
  pares: ParBitacora[]; alertas: AlertaBitacora[]; eventos: EventoBitacora[];
}

/** Color de CoreUI para un nivel de alerta (siempre acompañado de icono y texto). */
export function colorAlerta(nivel: NivelAlerta): 'danger' | 'warning' {
  return nivel === 'serious' ? 'danger' : 'warning';
}

export const TIPOS_EVENTO: { tipo: TipoEvento; etiqueta: string; icono: string }[] = [
  { tipo: 'COMBUSTIBLE', etiqueta: 'Combustible', icono: 'fa-gas-pump' },
  { tipo: 'MANTENIMIENTO', etiqueta: 'Mantenimiento', icono: 'fa-screwdriver-wrench' },
  { tipo: 'MOVILIZACION', etiqueta: 'Movilización', icono: 'fa-route' },
  { tipo: 'EMERGENCIA', etiqueta: 'Emergencia', icono: 'fa-truck-medical' },
];

export function filtrarEventos(eventos: EventoBitacora[], tipos: Set<TipoEvento>): EventoBitacora[] {
  return eventos.filter(e => tipos.has(e.tipo));
}

/** Rango por defecto: últimos 12 meses hasta hoy (Y-m-d). */
export function rangoPorDefecto(hoy = new Date()): { desde: string; hasta: string } {
  const f = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const desde = new Date(hoy.getFullYear(), hoy.getMonth() - 12, hoy.getDate() + 1);
  return { desde: f(desde), hasta: f(hoy) };
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
/** '2026-03' -> 'mar 2026' */
export function nombreMes(mes: string): string {
  const [a, m] = mes.split('-');
  return `${MESES[Number(m) - 1]} ${a}`;
}

/** '2026-03-05' -> '05/03/26' */
export function fechaCorta(f: string): string {
  const [a, m, d] = f.split('-');
  return `${d}/${m}/${a.slice(2)}`;
}

/** Nombre del vehículo para títulos: sigla, placa y marca/modelo/año. */
export function nombreVehiculo(v: VehiculoBitacora): string {
  const modelo = [v.vehiculo_marca, v.vehiculo_modelo, v.vehiculo_anio].filter(x => x !== null && x !== '' && x !== undefined).join(' ');
  return [v.vehiculo_sigla, v.vehiculo_placa].filter(Boolean).join(' · ') + (modelo ? ` — ${modelo}` : '');
}

/**
 * Paleta categórica validada (orden fijo: el color sigue a la serie, no a su posición).
 * Clara contra #ffffff, oscura contra #212631. Combustible siempre es la primera serie.
 */
export const PALETA_SERIES = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500'],
};

export interface ColoresGrafico { series: string[]; texto: string; rejilla: string; referencia: string; superficie: string; }

export function coloresGrafico(oscuro: boolean): ColoresGrafico {
  return oscuro
    ? { series: PALETA_SERIES.dark, texto: '#aab3c5', rejilla: 'rgba(255,255,255,0.08)', referencia: '#8a93a6', superficie: '#212631' }
    : { series: PALETA_SERIES.light, texto: '#5b6270', rejilla: 'rgba(0,0,0,0.07)', referencia: '#7a8190', superficie: '#ffffff' };
}

/** Línea de rendimiento por tramo (solo tramos válidos) y referencia horizontal del promedio de vehículos iguales. */
export function graficoRendimiento(tramos: TramoCombustible[], promedioPares: number | null, c: ColoresGrafico): ChartData<'line', (number | null)[], string> {
  const validos = tramos.filter(t => t.valido && t.rendimiento !== null);
  const etiquetas = validos.map(t => fechaCorta(t.fecha));
  const datasets: any[] = [{
    label: 'Este vehículo (km/gal)', data: validos.map(t => t.rendimiento), borderColor: c.series[0], backgroundColor: c.series[0],
    borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, pointBorderColor: c.superficie, pointBorderWidth: 2, tension: 0,
  }];
  if (promedioPares !== null) {
    datasets.push({
      label: 'Promedio de vehículos iguales', data: validos.map(() => promedioPares), borderColor: c.referencia, backgroundColor: c.referencia,
      borderWidth: 2, borderDash: [6, 4], pointRadius: 0, pointHoverRadius: 0, tension: 0,
    });
  }
  return { labels: etiquetas, datasets };
}

/** Barras apiladas de gasto mensual: combustible y cada rubro de mantenimiento, en orden fijo. */
export function graficoGasto(meses: GastoMes[], rubros: string[], c: ColoresGrafico): ChartData<'bar', number[], string> {
  const series = ['COMBUSTIBLE', ...rubros];
  return {
    labels: meses.map(m => nombreMes(m.mes)),
    datasets: series.map((s, i) => ({
      label: etiquetaSerie(s), data: meses.map(m => Number(m[s] ?? 0)),
      backgroundColor: c.series[i % c.series.length], borderColor: c.superficie, borderWidth: { top: 2, bottom: 0, left: 0, right: 0 },
      borderSkipped: false, borderRadius: 0, maxBarThickness: 28, stack: 'gasto',
    })),
  };
}

/** 'ACEITES Y LUBRICANTES' -> 'Aceites y lubricantes' */
export function etiquetaSerie(s: string): string {
  const t = s.toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Opciones comunes (un solo eje, rejilla tenue, leyenda arriba, tooltip por índice). */
export function opcionesGrafico(c: ColoresGrafico, unidad: 'km/gal' | 'USD', apilado = false): ChartOptions {
  const formato = (v: number) => unidad === 'USD'
    ? new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
    : `${new Intl.NumberFormat('es-EC', { maximumFractionDigits: 1 }).format(v)} km/gal`;
  return {
    responsive: true, maintainAspectRatio: false, animation: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'start', labels: { color: c.texto, boxWidth: 12, boxHeight: 12, usePointStyle: false } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${formato(ctx.parsed.y)}`,
          ...(apilado ? { footer: (items: any[]) => `Total: ${formato(items.reduce((s, i) => s + i.parsed.y, 0))}` } : {}),
        },
      },
    },
    scales: {
      x: { stacked: apilado, grid: { display: false }, ticks: { color: c.texto, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
      y: { stacked: apilado, beginAtZero: true, grid: { color: c.rejilla }, border: { display: false },
           ticks: { color: c.texto, callback: (v: number | string) => formato(Number(v)) } },
    },
  };
}
