import { altoBarrasImpresion, coloresImpresion, etiquetasValores, imagenGrafico, opcionesImpresion } from './grafico-impresion';
import { graficoPartesMes, graficoTop, opcionesConteo } from '../operaciones/models/partes-estadisticas.model';

describe('grafico-impresion', () => {
  it('usa la paleta clara y texto oscuro', () => {
    const c = coloresImpresion();
    expect(c.series[0]).toBe('#2a78d6');
    expect(c.superficie).toBe('#ffffff');
    expect(c.texto).toBe('#333333');
  });

  it('alto de barras horizontales limitado a 10 barras', () => {
    expect(altoBarrasImpresion(0)).toBe(154);
    expect(altoBarrasImpresion(3)).toBe(282);
    expect(altoBarrasImpresion(25)).toBe(altoBarrasImpresion(10));
  });

  it('opciones de impresión: tamaño fijo, sin tooltip ni animación, letra grande', () => {
    const o: any = opcionesImpresion(opcionesConteo(coloresImpresion(), { horizontal: true }), 20);
    expect(o.responsive).toBeFalse();
    expect(o.animation).toBeFalse();
    expect(o.plugins.tooltip.enabled).toBeFalse();
    expect(o.scales.x.ticks.font.size).toBe(20);
    expect(o.scales.y.ticks.font.size).toBe(20);
    expect(o.layout.padding.right).toBe(60);
    const v: any = opcionesImpresion(opcionesConteo(coloresImpresion(), { apilado: true }));
    expect(v.scales.x.ticks.maxRotation).toBe(0);
    expect(v.scales.x.ticks.autoSkip).toBeTrue();
  });

  it('etiquetas: valor por barra o total de la pila', () => {
    expect(etiquetasValores([{ data: [1200, 0, 3] }])).toEqual([['1.200', null, '3']]);
    expect(etiquetasValores([{ data: [1, 0] }, { data: [2, 0] }])).toEqual([[null, null], ['3', null]]);
  });

  it('dibuja un PNG del tamaño pedido y null sin datos', (done) => {
    const c = coloresImpresion();
    const png = imagenGrafico('bar', graficoPartesMes([{ mes: '2026-01', auxilio: 3, incendio: 1 }, { mes: '2026-02', auxilio: 2, incendio: 0 }], c),
      opcionesConteo(c, { apilado: true }), 800, 300);
    expect(png).toMatch(/^data:image\/png;base64,/);
    const img = new Image();
    img.onload = () => { expect([img.width, img.height]).toEqual([800, 300]); done(); };
    img.src = png!;
    expect(imagenGrafico('bar', graficoTop([], (x: any) => x, () => 0, c.series[0]), opcionesConteo(c), 800, 300)).toBeNull();
  });
});
