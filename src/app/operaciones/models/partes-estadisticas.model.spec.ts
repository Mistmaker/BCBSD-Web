import { coloresGrafico } from '../../administrativo/models/bitacora.model';
import { formatoMinutos, graficoPartesMes, graficoPorHora, graficoTop, nombreVehiculoParte, opcionesConteo } from './partes-estadisticas.model';

describe('partes-estadisticas.model', () => {
  const c = coloresGrafico(false);

  it('formatea minutos y nombres de vehículo', () => {
    expect(formatoMinutos(15)).toBe('15 min');
    expect(formatoMinutos(75.4)).toBe('1 h 15 min');
    expect(formatoMinutos(null)).toBe('—');
    expect(nombreVehiculoParte({ siglas: 'R-11', placa: 'PMA-8597', externo: false })).toBe('R-11 · PMA-8597');
    expect(nombreVehiculoParte({ siglas: null, placa: 'GRUA-1', externo: true })).toBe('GRUA-1 (externo)');
  });

  it('partes por mes: auxilio e incendio apilados con colores fijos', () => {
    const g = graficoPartesMes([{ mes: '2026-01', auxilio: 3, incendio: 1 }, { mes: '2026-02', auxilio: 0, incendio: 2 }], c);
    expect(g.labels).toEqual(['ene 2026', 'feb 2026']);
    expect(g.datasets.map(d => d.label)).toEqual(['Auxilio', 'Incendio']);
    expect(g.datasets[0].backgroundColor).toBe(c.series[0]);
    expect(g.datasets[1].backgroundColor).toBe(c.series[1]);
    expect(g.datasets[1].data).toEqual([1, 2]);
  });

  it('top n de una sola serie y hora del aviso', () => {
    const items = Array.from({ length: 12 }, (_, i) => ({ n: `V${i}`, v: 12 - i }));
    const g = graficoTop(items, x => x.n, x => x.v, c.series[0]);
    expect(g.labels?.length).toBe(10);
    expect(g.datasets[0].data[0]).toBe(12);
    const h = graficoPorHora(Array(24).fill(0).map((_, i) => i === 22 ? 4 : 0), c);
    expect(h.labels?.[22]).toBe('22h');
    expect(h.datasets[0].data[22]).toBe(4);
  });

  it('opciones: un solo eje de valores, leyenda solo si hay varias series', () => {
    const o: any = opcionesConteo(c, { horizontal: true });
    expect(o.indexAxis).toBe('y');
    expect(o.plugins.legend.display).toBeFalse();
    expect(Object.keys(o.scales)).toEqual(['x', 'y']);
    expect((opcionesConteo(c, { apilado: true }) as any).plugins.legend.display).toBeTrue();
  });
});
