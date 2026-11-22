import { ChartData, ChartOptions } from 'chart.js';
import { ColoresGrafico, nombreMes } from '../../administrativo/models/bitacora.model';

/** Respuesta de getEstadisticasPartes.php */
export interface EstadisticasPartes {
  desde: string;
  hasta: string;
  resumen: {
    partes: number; auxilio: number; incendio: number; victimas: number; fallecidos: number; personas_asistidas: number;
    respuesta_prom_min: number | null; respuesta_mediana_min: number | null; horas_operacion: number; km: number;
  };
  por_mes: { mes: string; auxilio: number; incendio: number }[];
  por_estacion: { estacion_id: number; estacion: string; partes: number; auxilio: number; incendio: number; respuesta_prom_min: number | null;
    salidas_vehiculos: number; participaciones: number }[];
  por_vehiculo: { vehiculo_id: number | null; siglas: string | null; placa: string | null; externo: boolean; salidas: number; km: number | null;
    horas: number | null; respuesta_prom_min: number | null; ultima: string }[];
  por_bombero: { personal_id: number; nombre: string; rango: string | null; participaciones: number; al_mando: number; aph: number; operativo: number;
    horas: number | null; ultima: string }[];
  por_recurso: { tipo: 'EQUIPO' | 'MATERIAL' | 'INSUMO'; recurso_id: number | null; descripcion: string; partes: number; cantidad: number }[];
  por_tipo_auxilio: { clasificacion: string; subclasificacion: string; partes: number }[];
  por_causa: { clasificacion: string; descripcion: string; partes: number }[];
  por_dia_semana: number[];
  por_hora: number[];
}

export const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const TIPO_RECURSO: Record<string, string> = { EQUIPO: 'Equipo / herramienta', MATERIAL: 'Material descartable', INSUMO: 'Insumo' };

/** 15 -> '15 min'; 75 -> '1 h 15 min'; null -> '—' */
export function formatoMinutos(min: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  const m = Math.round(min);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`;
}

/** Nombre del vehículo en la estadística: siglas · placa (externo si no es de la institución) */
export function nombreVehiculoParte(v: { siglas: string | null; placa: string | null; externo: boolean }): string {
  return [v.siglas, v.placa].filter(Boolean).join(' · ') + (v.externo ? ' (externo)' : '');
}

/** Barras apiladas por mes: auxilio (serie 1) e incendio (serie 2) */
export function graficoPartesMes(meses: EstadisticasPartes['por_mes'], c: ColoresGrafico): ChartData<'bar', number[], string> {
  const serie = (label: string, i: number, datos: number[]) => ({
    label, data: datos, backgroundColor: c.series[i], borderColor: c.superficie,
    borderWidth: { top: 2, bottom: 0, left: 0, right: 0 }, borderSkipped: false, borderRadius: 0, maxBarThickness: 28, stack: 'partes',
  });
  return {
    labels: meses.map(m => nombreMes(m.mes)),
    datasets: [serie('Auxilio', 0, meses.map(m => m.auxilio)), serie('Incendio', 1, meses.map(m => m.incendio))] as any,
  };
}

/** Barras horizontales de una sola serie con los primeros n elementos (orden ya viene de mayor a menor) */
export function graficoTop<T>(items: T[], etiqueta: (x: T) => string, valor: (x: T) => number, color: string, n = 10): ChartData<'bar', number[], string> {
  const top = items.slice(0, n);
  return {
    labels: top.map(etiqueta),
    datasets: [{ data: top.map(valor), backgroundColor: color, borderRadius: { topRight: 4, bottomRight: 4 } as any, borderSkipped: 'start',
      maxBarThickness: 18 }],
  };
}

/** Barras de una serie por hora del aviso (0-23) */
export function graficoPorHora(horas: number[], c: ColoresGrafico): ChartData<'bar', number[], string> {
  return {
    labels: horas.map((_, h) => `${String(h).padStart(2, '0')}h`),
    datasets: [{ label: 'Partes', data: horas, backgroundColor: c.series[0], borderRadius: { topLeft: 4, topRight: 4 } as any, borderSkipped: 'start', maxBarThickness: 18 }],
  };
}

/** Opciones: un eje de cantidades, rejilla tenue; leyenda solo con más de una serie */
export function opcionesConteo(c: ColoresGrafico, opciones: { horizontal?: boolean; apilado?: boolean; unidad?: string } = {}): ChartOptions {
  const unidad = opciones.unidad ?? 'partes';
  const valor = { grid: { color: c.rejilla }, border: { display: false }, beginAtZero: true, stacked: !!opciones.apilado,
    ticks: { color: c.texto, precision: 0 } };
  const categoria = { grid: { display: false }, stacked: !!opciones.apilado, ticks: { color: c.texto, autoSkip: !opciones.horizontal } };
  return {
    responsive: true, maintainAspectRatio: false, animation: false, indexAxis: opciones.horizontal ? 'y' : 'x',
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: !!opciones.apilado, position: 'top', align: 'start', labels: { color: c.texto, boxWidth: 12, boxHeight: 12 } },
      tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label ? ctx.dataset.label + ': ' : ''}${ctx.parsed[opciones.horizontal ? 'x' : 'y']} ${unidad}` } },
    },
    scales: opciones.horizontal ? { x: valor, y: categoria } : { x: categoria, y: valor },
  } as ChartOptions;
}
