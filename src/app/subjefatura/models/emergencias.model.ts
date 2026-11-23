import { ChartData } from 'chart.js';
import { ColoresGrafico, nombreMes } from '../../administrativo/models/bitacora.model';

/** Conteo con nombre (y detalle opcional: clasificación de la causa, uso del auxilio...) */
export interface Conteo { nombre: string; detalle: string | null; partes: number; }

export interface SeccionEmergencias {
  resumen: {
    partes: number; victimas: number; fallecidos: number; respuesta_prom_min: number | null;
    area_destruida_m2?: number; superficie_quemada_m2?: number; causante_identificado?: number; causante_no_identificado?: number;
  };
  por_parroquia: Conteo[];
  por_sector: Conteo[];
  causas: Conteo[];
  por_dia_semana: number[];
  por_hora: number[];
  tipos_incendio?: Conteo[];
  naturalezas?: Conteo[];
  clasificaciones?: Conteo[];
  subclasificaciones?: Conteo[];
}

/** Respuesta de getEstadisticasEmergencias.php (panel de la Subjefatura) */
export interface EstadisticasEmergencias {
  desde: string;
  hasta: string;
  resumen: { partes: number; incendio: number; auxilio: number; victimas: number; fallecidos: number; respuesta_prom_min: number | null };
  por_mes: { mes: string; incendio: number; auxilio: number }[];
  incendio: SeccionEmergencias;
  auxilio: SeccionEmergencias;
  puntos: { parte_id: number; numero: string; tipo: 'INCENDIO' | 'AUXILIO'; fecha: string; lat: number; lng: number; detalle: string | null }[];
}

export type TipoEmergencia = 'INCENDIO' | 'AUXILIO';

/** Color fijo por tipo (el mismo que en la estadística de Operaciones): auxilio serie 1, incendio serie 2 */
export function colorTipo(tipo: TipoEmergencia, c: ColoresGrafico): string {
  return tipo === 'AUXILIO' ? c.series[0] : c.series[1];
}

/** Barras apiladas por mes: auxilio e incendio */
export function graficoEmergenciasMes(meses: EstadisticasEmergencias['por_mes'], c: ColoresGrafico): ChartData<'bar', number[], string> {
  const serie = (label: string, tipo: TipoEmergencia, datos: number[]) => ({
    label, data: datos, backgroundColor: colorTipo(tipo, c), borderColor: c.superficie,
    borderWidth: { top: 2, bottom: 0, left: 0, right: 0 }, borderSkipped: false, borderRadius: 0, maxBarThickness: 28, stack: 'emergencias',
  });
  return {
    labels: meses.map(m => nombreMes(m.mes)),
    datasets: [serie('Auxilio', 'AUXILIO', meses.map(m => m.auxilio)), serie('Incendio', 'INCENDIO', meses.map(m => m.incendio))] as any,
  };
}

/** Momento crítico: índice con más partes (null si no hay datos). Para hora (0-23) y día de la semana (0 = lunes). */
export function indiceCritico(valores: number[]): number | null {
  const max = Math.max(0, ...valores);
  return max > 0 ? valores.indexOf(max) : null;
}

/** Porcentaje entero de una parte sobre el total ('—' si el total es 0) */
export function porcentaje(parte: number, total: number): string {
  return total > 0 ? `${Math.round(parte / total * 100)} %` : '—';
}

/** Etiqueta de un conteo con su detalle: 'Evacuación (Personas)' */
export function etiquetaConteo(c: Conteo): string {
  return c.detalle ? `${c.nombre} (${c.detalle})` : c.nombre;
}
