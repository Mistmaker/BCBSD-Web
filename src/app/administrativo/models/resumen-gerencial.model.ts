/** Resumen gerencial de la Dirección Administrativa: cifras para la dirección (el detalle está en la bitácora). */
import type { ChartData } from 'chart.js';
import { ColoresGrafico, nombreMes } from './bitacora.model';

export interface MesResumen { mes: string; combustible: number; galones: number; mantenimiento: number; ordenes_mantenimiento: number; movilizaciones: number; }

export interface ResumenGerencial {
  mes: string;
  flota: {
    activos: number; en_taller: number; en_salida: number; mantenimiento_vencido: number; mantenimiento_proximo: number; sin_plan: number;
    atencion: { vehiculo_id: number; vehiculo_sigla: string | null; vehiculo_placa: string; estado: 'VENCIDO' | 'PROXIMO'; km_actual: number; km_proximo: number | null }[];
  };
  gasto: {
    mes: { combustible: number; galones: number; mantenimiento: number; ordenes_mantenimiento: number; movilizaciones: number };
    anio: { combustible: number; mantenimiento: number; por_rubro: { rubro: string; total: number }[] };
    meses: MesResumen[];
  };
  contratos: { contrato_id: number; contrato_codigo: string; contrato_taller: string | null; contrato_fecha_fin: string | null; asignado: number; consumido: number; saldo: number }[];
  alertas: { vehiculos: number; detalle: { vehiculo_id: number; vehiculo_sigla: string | null; vehiculo_placa: string; alertas: string[]; costo_total: number }[] };
  licencias: { VIGENTE: number; 'POR VENCER': number; VENCIDA: number };
  peticiones: { mes: number; anio: number };
}

/** Variación porcentual respecto al mes anterior (null si no hay base) */
export function variacion(actual: number, anterior: number | null | undefined): number | null {
  if (!anterior) { return null; }
  return Math.round((actual - anterior) / anterior * 1000) / 10;
}

/** Porcentaje consumido de un contrato (0-100) */
export function porcentajeConsumido(c: { asignado: number | string; consumido: number | string }): number {
  const a = Number(c.asignado) || 0;
  return a > 0 ? Math.min(100, Math.round(Number(c.consumido) / a * 1000) / 10) : 0;
}

/** Texto corto de cada alerta de la bitácora */
export const TEXTO_ALERTA: Record<string, string> = {
  TRABAJO_REPETIDO: 'trabajo repetido',
  RENDIMIENTO_BAJO: 'consume más combustible',
  COSTO_MANTENIMIENTO_ALTO: 'mantenimiento caro',
  LECTURAS_KM: 'lecturas de km',
};

/** Barras apiladas por mes: combustible y mantenimiento (primeras dos series de la paleta, en orden fijo) */
export function graficoGastoMensual(meses: MesResumen[], c: ColoresGrafico): ChartData<'bar', number[], string> {
  const serie = (label: string, datos: number[], color: string) => ({
    label, data: datos, backgroundColor: color, borderColor: c.superficie, borderWidth: { top: 2, bottom: 0, left: 0, right: 0 },
    borderSkipped: false, maxBarThickness: 32, stack: 'gasto',
  });
  return {
    labels: meses.map(m => nombreMes(m.mes)),
    datasets: [
      serie('Combustible', meses.map(m => Number(m.combustible)), c.series[0]),
      serie('Mantenimiento', meses.map(m => Number(m.mantenimiento)), c.series[1]),
    ],
  };
}

/** Mes anterior en formato AAAA-MM */
export function mesAnterior(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, '0')}`;
}
