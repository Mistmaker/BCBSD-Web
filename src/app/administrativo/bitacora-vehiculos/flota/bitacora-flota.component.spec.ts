import { coloresGrafico, FilaFlotaBitacora, graficoGastoFlota } from '../../models/bitacora.model';
import { graficosInformeFlota, ordenarFlota } from './bitacora-flota.component';

const fila = (id: number, sigla: string, extra: Partial<FilaFlotaBitacora> = {}): FilaFlotaBitacora =>
  ({ vehiculo_id: id, vehiculo_sigla: sigla, vehiculo_placa: 'P' + id, alertas: [], costo_total_km: null, rendimiento_dif_pct: null,
     gasto_mantenimiento: 0, km_recorridos: 0, ...extra } as FilaFlotaBitacora);

describe('ordenarFlota', () => {
  const grave = { tipo: 'TRABAJO_REPETIDO', nivel: 'serious' as const, mensaje: '' };
  const leve = { tipo: 'LECTURAS_KM', nivel: 'warning' as const, mensaje: '' };
  const lista = () => [
    fila(1, 'CAM-10', { alertas: [leve], costo_total_km: 0.5, rendimiento_dif_pct: 5 }),
    fila(2, 'CAM-2', { alertas: [grave, leve], costo_total_km: 0.2, rendimiento_dif_pct: -30, gasto_mantenimiento: 900 }),
    fila(3, 'CAM-3', { costo_total_km: 0.9 }),
  ];

  it('por alertas: primero las graves', () => {
    expect(ordenarFlota(lista(), 'alertas').map(f => f.vehiculo_id)).toEqual([2, 1, 3]);
  });

  it('por sigla con orden numérico', () => {
    expect(ordenarFlota(lista(), 'sigla').map(f => f.vehiculo_sigla)).toEqual(['CAM-2', 'CAM-3', 'CAM-10']);
  });

  it('por costo por km (mayor primero) y por rendimiento vs. iguales (peor primero, sin dato al final)', () => {
    expect(ordenarFlota(lista(), 'costo_total_km').map(f => f.vehiculo_id)).toEqual([3, 1, 2]);
    expect(ordenarFlota(lista(), 'rendimiento_dif_pct').map(f => f.vehiculo_id)).toEqual([2, 1, 3]);
    expect(ordenarFlota(lista(), 'gasto_mantenimiento')[0].vehiculo_id).toBe(2);
  });
});

describe('informe de la flota', () => {
  const filas = Array.from({ length: 20 }, (_, i) => fila(i + 1, 'V-' + (i + 1),
    { gasto_combustible: i * 10, gasto_mantenimiento: i === 0 ? 0 : 5, costo_total: i === 0 ? 0 : i * 10 + 5 }));

  it('gasto por vehículo: los 15 de mayor gasto, sin los que no gastaron', () => {
    const g = graficoGastoFlota(filas, coloresGrafico(false));
    expect(g.labels!.length).toBe(15);
    expect(g.labels![0]).toBe('V-20 · P20');
    expect(g.datasets.map(d => d.label)).toEqual(['Combustible', 'Mantenimiento']);
    expect(g.datasets[0].data[0]).toBe(190);
  });

  it('dibuja el PNG del gráfico; sin gasto no hay gráfico', () => {
    expect(graficosInformeFlota(filas)['gasto']).toMatch(/^data:image\/png;base64,/);
    expect(graficosInformeFlota([filas[0]])['gasto']).toBeNull();
  });
});
