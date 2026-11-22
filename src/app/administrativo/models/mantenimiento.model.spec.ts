import {
  ConfiguracionMantenimiento, ContratoMantenimientoModel, contratoParaGuardar, permisoOrden, listaParametro, numeroInforme, PartidaContratoModel, saldoParaOrden, totalesPorRubro, totalesRubroOrdenes,
  colorEstadoMantenimiento, FacturaMantenimientoModel, OrdenMantenimientoModel, ordenParaGuardar, PlanMantenimientoModel,
  planParaGuardar, ReglaMantenimientoModel
} from './mantenimiento.model';

describe('mantenimiento.model', () => {
  it('ordenParaGuardar quita campos de la vista y filas vacías', () => {
    const orden = Object.assign(new OrdenMantenimientoModel(), {
      orden_id: 5, fk_vehiculo_id: 1, vehiculo_sigla: 'B-1', s_nombre: 'X', total_facturas: 10, totales_rubro: '{}', informe_id: 3, usuario: 'admin', informe_numero: 'INF-1',
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
    expect(datos.totales_rubro).toBeUndefined();
    expect(datos.informe_numero).toBeUndefined('la bitácora se asigna desde el informe, no desde la orden');
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
    expect(colorEstadoMantenimiento('ENTREGADO')).toBe('success');
    expect(colorEstadoMantenimiento('RECIBIDO')).toBe('info');
    expect(colorEstadoMantenimiento('MANTENIMIENTO')).toBe('warning');
    expect(colorEstadoMantenimiento('SIN PLAN')).toBe('secondary');
    expect(colorEstadoMantenimiento(undefined)).toBe('secondary');
  });

  it('lee parámetros tipo lista con valor por defecto', () => {
    const config = { parametros: [{ param_key: 'MANT_RUBROS', param_value: 'MANO DE OBRA| REPUESTOS |', param_name: '' }] } as ConfiguracionMantenimiento;
    expect(listaParametro(config, 'MANT_RUBROS', ['X'])).toEqual(['MANO DE OBRA', 'REPUESTOS']);
    expect(listaParametro(config, 'OTRO', ['X'])).toEqual(['X']);
    expect(listaParametro(null, 'MANT_RUBROS', ['X'])).toEqual(['X']);
  });

  it('totaliza por rubro en el orden configurado, ignorando valores vacíos', () => {
    const f = (tipo: string, valor: any) => Object.assign(new FacturaMantenimientoModel(), { factura_tipo: tipo, factura_valor: valor });
    const rubros = ['MANO DE OBRA', 'REPUESTOS', 'ACEITES Y LUBRICANTES'];
    expect(totalesPorRubro([f('REPUESTOS', '415'), f('MANO DE OBRA', 51.1), f('REPUESTOS', '10.10'), f('ACEITES Y LUBRICANTES', ''), f('FACTURA', 5)], rubros))
      .toEqual([{ rubro: 'MANO DE OBRA', total: 51.1 }, { rubro: 'REPUESTOS', total: 425.1 }, { rubro: 'FACTURA', total: 5 }]);
  });

  it('suma los totales por rubro de varias órdenes', () => {
    const o1 = Object.assign(new OrdenMantenimientoModel(), { totales_rubro: '{"MANO DE OBRA": 10, "REPUESTOS": 5}' });
    const o2 = Object.assign(new OrdenMantenimientoModel(), { totales_rubro: { 'MANO DE OBRA': 2.5 } });
    expect(totalesRubroOrdenes([o1, o2], ['MANO DE OBRA', 'REPUESTOS'])).toEqual([{ rubro: 'MANO DE OBRA', total: 12.5 }, { rubro: 'REPUESTOS', total: 5 }]);
  });

  it('formatea el número de informe individual con 3 dígitos', () => {
    expect(numeroInforme(5)).toBe('005');
    expect(numeroInforme('12')).toBe('012');
    expect(numeroInforme(1234)).toBe('1234');
    expect(numeroInforme(0)).toBe('—');
    expect(numeroInforme(null)).toBe('—');
  });

  it('saldo para una orden: suma lo ya guardado de la orden y descuenta los valores actuales', () => {
    const partidas = [
      Object.assign(new PartidaContratoModel(), { partida_rubro: 'MANO DE OBRA', saldo: '100.00' }),
      Object.assign(new PartidaContratoModel(), { partida_rubro: 'REPUESTOS', saldo: '0' }),
    ];
    const f = (tipo: string, valor: any) => Object.assign(new FacturaMantenimientoModel(), { factura_tipo: tipo, factura_valor: valor });
    // la orden ya tenía 50 de repuestos guardados (el saldo del contrato ya los descontó)
    expect(saldoParaOrden(partidas, { REPUESTOS: 50 }, [f('MANO DE OBRA', 120), f('REPUESTOS', 50)])).toEqual([
      { rubro: 'MANO DE OBRA', disponible: 100, estaOrden: 120, restante: -20 },
      { rubro: 'REPUESTOS', disponible: 50, estaOrden: 50, restante: 0 },
    ]);
  });

  it('contratoParaGuardar envía partidas numéricas y vehículos como ids', () => {
    const c = Object.assign(new ContratoMantenimientoModel(), {
      contrato_codigo: 'C-1', contrato_taller: 'T', saldo: 5, administrador_nombre: 'X',
      partidas: [Object.assign(new PartidaContratoModel(), { partida_rubro: 'REPUESTOS', partida_monto: '150.5', partida_codigo: '' }),
                 Object.assign(new PartidaContratoModel(), { partida_rubro: '' })],
      vehiculos: [3, { vehiculo_id: 4, vehiculo_sigla: 'A', vehiculo_placa: 'B' }],
    });
    const d = contratoParaGuardar(c);
    expect(d.saldo).toBeUndefined();
    expect(d.administrador_nombre).toBeUndefined();
    expect(d.partidas).toEqual([{ partida_rubro: 'REPUESTOS', partida_codigo: null, partida_monto: 150.5 }]);
    expect(d.vehiculos).toEqual([3, 4]);
  });

  it('privilegio necesario según el estado (igual que el API)', () => {
    expect(permisoOrden(null, 'MANTENIMIENTO')).toBe('MANT_ORDEN_CREAR');
    expect(permisoOrden('MANTENIMIENTO', 'RECIBIDO')).toBe('MANT_ORDEN_RECIBIR');
    expect(permisoOrden('RECIBIDO', 'ENTREGADO')).toBe('MANT_ORDEN_ACTA');
    expect(permisoOrden('ENTREGADO', 'RECIBIDO')).toBe('MANT_ORDEN_ACTA');
    expect(permisoOrden('RECIBIDO', 'MANTENIMIENTO')).toBe('MANT_ORDEN_CREAR');
    expect(permisoOrden('RECIBIDO', 'ANULADA')).toBe('MANT_ORDEN_ANULAR');
  });
});
