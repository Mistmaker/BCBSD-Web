import {
  colorEstadoMantenimiento, FacturaMantenimientoModel, OrdenMantenimientoModel, ordenParaGuardar, PlanMantenimientoModel,
  planParaGuardar, ReglaMantenimientoModel
} from './mantenimiento.model';

describe('mantenimiento.model', () => {
  it('ordenParaGuardar quita campos de la vista y filas vacías', () => {
    const orden = Object.assign(new OrdenMantenimientoModel(), {
      orden_id: 5, fk_vehiculo_id: 1, vehiculo_sigla: 'B-1', s_nombre: 'X', total_facturas: 10, informe_id: 3, usuario: 'admin',
      trabajos: [{ trabajo_descripcion: '  Cambio de aceite ' }, { trabajo_descripcion: '   ' }],
      sugeridos: [{ trabajo_descripcion: '' }],
      anexos: [{ anexo_descripcion: 'Fotos' }],
      facturas: [
        Object.assign(new FacturaMantenimientoModel(), { factura_id: 9, factura_numero: '001', factura_valor: 10 }),
        new FacturaMantenimientoModel(), // vacía
        Object.assign(new FacturaMantenimientoModel(), { factura_valor: 0 }), // valor 0 sí cuenta
      ],
    });
    const datos = ordenParaGuardar(orden) as any;
    expect(datos.vehiculo_sigla).toBeUndefined();
    expect(datos.s_nombre).toBeUndefined();
    expect(datos.informe_id).toBeUndefined();
    expect(datos.orden_id).toBe(5);
    expect(datos.trabajos).toEqual([{ trabajo_descripcion: 'Cambio de aceite' }]);
    expect(datos.sugeridos).toEqual([]);
    expect(datos.anexos).toEqual([{ anexo_descripcion: 'Fotos' }]);
    expect(datos.facturas.length).toBe(2);
    expect(datos.facturas[0].factura_id).toBeUndefined();
  });

  it('planParaGuardar convierte recursos y vehículos en ids', () => {
    const plan = Object.assign(new PlanMantenimientoModel(), {
      plan_id: 2, plan_modelo: 'HINO',
      reglas: [Object.assign(new ReglaMantenimientoModel(), {
        mantenimiento_km_inicio: '', mantenimiento_km_intervalo: '10000',
        recursos: [3, { recurso_id: 4, recurso_descripcion: 'FILTRO' }],
      })],
      vehiculos: [7, { vehiculo_id: 8, vehiculo_sigla: 'B-2', vehiculo_placa: 'P' }],
    });
    expect(planParaGuardar(plan)).toEqual({
      plan_id: 2, plan_modelo: 'HINO', plan_observaciones: null, plan_estado: 'ACTIVO',
      reglas: [{ mantenimiento_km_inicio: 0, mantenimiento_km_intervalo: 10000, recursos: [3, 4] }],
      vehiculos: [7, 8],
    });
  });

  it('asigna colores por estado', () => {
    expect(colorEstadoMantenimiento('VENCIDO')).toBe('danger');
    expect(colorEstadoMantenimiento('PROXIMO')).toBe('warning');
    expect(colorEstadoMantenimiento('AL DIA')).toBe('success');
    expect(colorEstadoMantenimiento('FINALIZADA')).toBe('success');
    expect(colorEstadoMantenimiento('SIN PLAN')).toBe('secondary');
    expect(colorEstadoMantenimiento(undefined)).toBe('secondary');
  });
});
