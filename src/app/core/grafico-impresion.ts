import { Chart, ChartData, ChartOptions, ChartType, Plugin, registerables } from 'chart.js';

import { coloresGrafico, ColoresGrafico } from '../administrativo/models/bitacora.model';

Chart.register(...registerables);

/**
 * Gráficos para los informes imprimibles: los mismos datos y funciones del tablero, dibujados fuera de pantalla con
 * tamaño fijo, paleta clara (aunque la pantalla esté en modo oscuro), letra grande y el valor sobre cada barra
 * (en papel no hay tooltip). Devuelven un PNG en base64 que el API inserta en el PDF.
 */

/** Ancho en px de un gráfico a ancho completo de la hoja (170 mm): ~9,4 px por mm */
export const IMPRESION_ANCHO = 1600;
/** Tamaño de letra en px para ese ancho (~8 pt en el papel) */
export const IMPRESION_FUENTE = 24;

/** Colores para papel: paleta clara validada y texto más oscuro que en pantalla */
export function coloresImpresion(): ColoresGrafico {
  return { ...coloresGrafico(false), texto: '#333333', rejilla: 'rgba(0,0,0,0.12)' };
}

/** Alto en px de un gráfico de barras horizontales con n barras (máx. 10) */
export function altoBarrasImpresion(n: number): number {
  return Math.min(Math.max(n, 1), 10) * 64 + 90;
}

/** Ajusta las opciones del tablero para imprimir (sin animación ni tooltip, tamaño fijo, letra grande). Modifica el objeto. */
export function opcionesImpresion(opciones: ChartOptions, fuente = IMPRESION_FUENTE): ChartOptions {
  const o = opciones as any;
  o.responsive = false;
  o.maintainAspectRatio = false;
  o.animation = false;
  o.devicePixelRatio = 1;
  o.events = [];
  o.plugins = { ...(o.plugins ?? {}), tooltip: { enabled: false } };
  if (o.plugins.legend) {
    o.plugins.legend = { ...o.plugins.legend, labels: { ...(o.plugins.legend.labels ?? {}), font: { size: fuente }, boxWidth: fuente, boxHeight: fuente } };
  }
  const horizontal = o.indexAxis === 'y';
  for (const [eje, escala] of Object.entries(o.scales ?? {}) as [string, any][]) {
    escala.ticks = { ...(escala.ticks ?? {}), font: { size: fuente } };
    if (eje === 'x' && !horizontal) {
      // Etiquetas horizontales; si no caben todas (p. ej. 24 meses) se omiten algunas
      escala.ticks = { ...escala.ticks, maxRotation: 0, autoSkip: true, autoSkipPadding: fuente / 2 };
    }
  }
  o.layout = { padding: horizontal ? { right: fuente * 3, top: 8 } : { top: fuente * 1.5, right: 8 } };
  return opciones;
}

/** Texto de cada valor sobre su barra; en barras apiladas, el total de la pila. Ceros sin etiqueta. */
export function etiquetasValores(datasets: { data: (number | null)[] }[]): (string | null)[][] {
  if (datasets.length === 1) {
    return [datasets[0].data.map(v => (v ? new Intl.NumberFormat('es-EC').format(v) : null))];
  }
  const totales = datasets[0].data.map((_, i) => datasets.reduce((s, d) => s + Number(d.data[i] ?? 0), 0));
  return datasets.map((_, j) => j === datasets.length - 1 ? totales.map(t => (t ? new Intl.NumberFormat('es-EC').format(t) : null)) : totales.map(() => null));
}

/** Plugin que escribe los valores (etiquetasValores) al final de cada barra */
function pluginValores(fuente: number, color: string): Plugin {
  return {
    id: 'valoresImpresion',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      const horizontal = (chart.options as any).indexAxis === 'y';
      const textos = etiquetasValores(chart.data.datasets as any);
      ctx.save();
      ctx.font = `600 ${Math.round(fuente * 0.9)}px sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = horizontal ? 'left' : 'center';
      ctx.textBaseline = horizontal ? 'middle' : 'bottom';
      chart.data.datasets.forEach((_, j) => {
        chart.getDatasetMeta(j).data.forEach((barra: any, i) => {
          const t = textos[j]?.[i];
          if (t) {
            ctx.fillText(t, horizontal ? barra.x + 6 : barra.x, horizontal ? barra.y : barra.y - 4);
          }
        });
      });
      ctx.restore();
    },
  };
}

/**
 * Dibuja el gráfico en un canvas fuera de pantalla y devuelve 'data:image/png;base64,...' (null si no hay datos).
 * El fondo es blanco para que el PDF no muestre transparencias.
 */
export function imagenGrafico(tipo: ChartType, data: ChartData | null, opciones: ChartOptions, ancho: number, alto: number,
                              valores = true, fuente = IMPRESION_FUENTE): string | null {
  if (!data || !data.datasets.length || !(data.labels?.length)) {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  const fondo: Plugin = {
    id: 'fondoImpresion',
    beforeDraw(chart) {
      chart.ctx.save();
      chart.ctx.fillStyle = '#ffffff';
      chart.ctx.fillRect(0, 0, chart.width, chart.height);
      chart.ctx.restore();
    },
  };
  const grafico = new Chart(canvas, {
    type: tipo, data: data as any, options: opcionesImpresion(opciones, fuente) as any,
    plugins: valores && tipo === 'bar' ? [fondo, pluginValores(fuente, '#333333')] : [fondo],
  });
  try {
    return grafico.toBase64Image('image/png');
  } finally {
    grafico.destroy();
  }
}
