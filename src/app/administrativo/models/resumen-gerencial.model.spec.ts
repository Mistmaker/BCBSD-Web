import { coloresGrafico, PALETA_SERIES } from './bitacora.model';
import { graficoGastoMensual, mesAnterior, porcentajeConsumido, variacion } from './resumen-gerencial.model';

describe('resumen-gerencial.model', () => {
  it('variación respecto al mes anterior', () => {
    expect(variacion(120, 100)).toBe(20);
    expect(variacion(75, 100)).toBe(-25);
    expect(variacion(50, 0)).toBeNull();
    expect(variacion(50, null)).toBeNull();
  });

  it('porcentaje consumido del contrato (tope 100)', () => {
    expect(porcentajeConsumido({ asignado: '3000', consumido: '466.1' })).toBe(15.5);
    expect(porcentajeConsumido({ asignado: 100, consumido: 150 })).toBe(100);
    expect(porcentajeConsumido({ asignado: 0, consumido: 10 })).toBe(0);
  });

  it('mes anterior', () => {
    expect(mesAnterior('2026-03')).toBe('2026-02');
    expect(mesAnterior('2026-01')).toBe('2025-12');
  });

  it('gráfico: combustible y mantenimiento apilados con la paleta en orden fijo', () => {
    const g = graficoGastoMensual([{ mes: '2026-10', combustible: 100, galones: 30, mantenimiento: 50, ordenes_mantenimiento: 1, movilizaciones: 2 },
                                   { mes: '2026-11', combustible: '80' as any, galones: 20, mantenimiento: 0, ordenes_mantenimiento: 0, movilizaciones: 0 }], coloresGrafico(false));
    expect(g.labels).toEqual(['oct 2026', 'nov 2026']);
    expect(g.datasets.map(d => d.label)).toEqual(['Combustible', 'Mantenimiento']);
    expect(g.datasets[0].data).toEqual([100, 80]);
    expect(g.datasets.map(d => d.backgroundColor)).toEqual(PALETA_SERIES.light.slice(0, 2));
  });
});
