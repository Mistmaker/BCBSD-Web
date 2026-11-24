import { RespuestaVehiculo } from '../../models/bitacora.model';
import { graficosInformeVehiculo } from './bitacora-vehiculo.component';

describe('informe del vehículo', () => {
  const comp = { valor: null, promedio_pares: 12, pares_con_dato: 1, diferencia_pct: null };
  const datos = {
    desde: '2026-01-01', hasta: '2026-03-31', rubros: ['REPUESTOS'],
    tramos: [{ carga_id: 1, codigo: 'C1', fecha: '2026-01-10', km: 100, km_recorridos: 120, galones: 10, valor: 30, dias: 5, rendimiento: 12, costo_km: 0.25,
      valido: true, motivo: null, incluye_cargas_sin_lectura: false }],
    gasto_mensual: [{ mes: '2026-01', COMBUSTIBLE: 30, REPUESTOS: 100, total: 130 }, { mes: '2026-02', COMBUSTIBLE: 0, REPUESTOS: 0, total: 0 }],
    comparacion: { rendimiento: comp, costo_mant_km: comp, costo_total_km: comp },
  } as unknown as RespuestaVehiculo;

  it('rendimiento y gasto mensual en PNG; sin cargas válidas no hay gráfico de rendimiento', () => {
    const g = graficosInformeVehiculo(datos);
    expect(g['rendimiento']).toMatch(/^data:image\/png;base64,/);
    expect(g['gasto']).toMatch(/^data:image\/png;base64,/);
    expect(graficosInformeVehiculo({ ...datos, tramos: [] })['rendimiento']).toBeNull();
  });
});
