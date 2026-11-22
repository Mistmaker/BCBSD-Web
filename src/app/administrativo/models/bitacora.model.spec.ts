import {
  coloresGrafico, colorAlerta, etiquetaSerie, EventoBitacora, filtrarEventos, GastoMes, graficoGasto, graficoRendimiento, nombreMes, nombreVehiculo,
  opcionesGrafico, PALETA_SERIES, rangoPorDefecto, TramoCombustible, VehiculoBitacora
} from './bitacora.model';

const tramo = (fecha: string, rendimiento: number | null, valido = true): TramoCombustible => ({
  carga_id: 1, codigo: 'C', fecha, km: 1, km_recorridos: 1, galones: 1, valor: 1, dias: 1, rendimiento, costo_km: null, valido,
  motivo: valido ? null : 'Carga sin kilometraje', incluye_cargas_sin_lectura: false,
});

describe('bitacora.model', () => {
  it('rango por defecto: últimos 12 meses hasta hoy', () => {
    expect(rangoPorDefecto(new Date(2026, 10, 22))).toEqual({ desde: '2025-11-23', hasta: '2026-11-22' });
  });

  it('formatea mes, serie y vehículo', () => {
    expect(nombreMes('2026-03')).toBe('mar 2026');
    expect(etiquetaSerie('ACEITES Y LUBRICANTES')).toBe('Aceites y lubricantes');
    const v = { vehiculo_sigla: 'CAM-01', vehiculo_placa: 'PEA-1234', vehiculo_marca: 'TOYOTA', vehiculo_modelo: 'HILUX', vehiculo_anio: 2018 } as VehiculoBitacora;
    expect(nombreVehiculo(v)).toBe('CAM-01 · PEA-1234 — TOYOTA HILUX 2018');
    expect(nombreVehiculo({ ...v, vehiculo_sigla: null, vehiculo_marca: null, vehiculo_modelo: null, vehiculo_anio: null })).toBe('PEA-1234');
  });

  it('alertas graves en rojo, de atención en amarillo', () => {
    expect(colorAlerta('serious')).toBe('danger');
    expect(colorAlerta('warning')).toBe('warning');
  });

  it('filtra el historial por tipo', () => {
    const ev = [{ tipo: 'COMBUSTIBLE' }, { tipo: 'MANTENIMIENTO' }, { tipo: 'EMERGENCIA' }] as EventoBitacora[];
    expect(filtrarEventos(ev, new Set(['MANTENIMIENTO', 'EMERGENCIA'])).map(e => e.tipo)).toEqual(['MANTENIMIENTO', 'EMERGENCIA']);
  });

  it('gráfico de rendimiento: solo tramos válidos y línea de referencia de los iguales', () => {
    const c = coloresGrafico(false);
    const g = graficoRendimiento([tramo('2026-01-01', 30), tramo('2026-02-01', null, false), tramo('2026-03-01', 25)], 28, c);
    expect(g.labels).toEqual(['01/01/26', '01/03/26']);
    expect(g.datasets.length).toBe(2);
    expect(g.datasets[0].data).toEqual([30, 25]);
    expect(g.datasets[0].borderColor).toBe(PALETA_SERIES.light[0]);
    expect(g.datasets[1].data).toEqual([28, 28]);
    expect(graficoRendimiento([tramo('2026-01-01', 30)], null, c).datasets.length).toBe(1); // sin iguales, sin referencia
  });

  it('gráfico de gasto: combustible primero y rubros en orden fijo, con la paleta del modo', () => {
    const meses = [{ mes: '2026-01', COMBUSTIBLE: 20, 'MANO DE OBRA': 0, REPUESTOS: 100, total: 120 }] as unknown as GastoMes[];
    const g = graficoGasto(meses, ['MANO DE OBRA', 'REPUESTOS'], coloresGrafico(true));
    expect(g.labels).toEqual(['ene 2026']);
    expect(g.datasets.map(d => d.label)).toEqual(['Combustible', 'Mano de obra', 'Repuestos']);
    expect(g.datasets.map(d => d.backgroundColor)).toEqual(PALETA_SERIES.dark.slice(0, 3));
    expect(g.datasets[2].data).toEqual([100]);
  });

  it('opciones: un solo eje, apilado cuando corresponde y formato de moneda', () => {
    const o: any = opcionesGrafico(coloresGrafico(false), 'USD', true);
    expect(Object.keys(o.scales)).toEqual(['x', 'y']);
    expect(o.scales.y.stacked).toBeTrue();
    expect(o.scales.y.ticks.callback(1500)).toContain('1');
    expect(o.plugins.tooltip.callbacks.footer([{ parsed: { y: 10 } }, { parsed: { y: 5 } }])).toContain('15');
    const r: any = opcionesGrafico(coloresGrafico(false), 'km/gal');
    expect(r.scales.y.ticks.callback(25)).toBe('25 km/gal');
    expect(r.plugins.tooltip.callbacks.footer).toBeUndefined();
  });
});
