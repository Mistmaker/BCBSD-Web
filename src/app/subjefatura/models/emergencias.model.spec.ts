import { coloresGrafico } from '../../administrativo/models/bitacora.model';
import { colorTipo, etiquetaConteo, graficoEmergenciasMes, indiceCritico, porcentaje } from './emergencias.model';

describe('emergencias.model', () => {
  const c = coloresGrafico(false);

  it('colores fijos por tipo, iguales a la estadística de Operaciones', () => {
    expect(colorTipo('AUXILIO', c)).toBe(c.series[0]);
    expect(colorTipo('INCENDIO', c)).toBe(c.series[1]);
    const g = graficoEmergenciasMes([{ mes: '2026-05', incendio: 2, auxilio: 5 }], c);
    expect(g.labels).toEqual(['may 2026']);
    expect(g.datasets.map(d => d.label)).toEqual(['Auxilio', 'Incendio']);
    expect(g.datasets[1].data).toEqual([2]);
  });

  it('momento crítico, porcentaje y etiqueta', () => {
    expect(indiceCritico([0, 3, 7, 7])).toBe(2);
    expect(indiceCritico([0, 0])).toBeNull();
    expect(porcentaje(1, 3)).toBe('33 %');
    expect(porcentaje(1, 0)).toBe('—');
    expect(etiquetaConteo({ nombre: 'Auxilio / Evacuación', detalle: 'Personas', partes: 2 })).toBe('Auxilio / Evacuación (Personas)');
    expect(etiquetaConteo({ nombre: 'Vivienda', detalle: null, partes: 2 })).toBe('Vivienda');
  });
});
