import {
  causasDe, clasificacionesAuxilio, fechaHoraAviso, idTipoAuxilio, kmRecorridos, minutosRespuesta, ParteModel, ParteTipoAuxilioDetalle,
  ParteVehiculoDetalle, PartePersonalDetalle, ROL_MANDO, subclasificacionesAuxilio, TipoAuxilioCatalogo, usosAuxilio, validarParte
} from './partes.model';

const CATALOGO: TipoAuxilioCatalogo[] = [
  { tipo_auxilio_id: 1, clasificacion: 'Falsa alarma', subclasificacion: '', uso_tipo: '' },
  { tipo_auxilio_id: 2, clasificacion: 'Auxilio', subclasificacion: 'Evacuación', uso_tipo: 'Personas' },
  { tipo_auxilio_id: 3, clasificacion: 'Auxilio', subclasificacion: 'Evacuación', uso_tipo: 'Menaje + personas' },
  { tipo_auxilio_id: 4, clasificacion: 'Auxilio', subclasificacion: 'General', uso_tipo: '' },
];

function vehiculo(cambios: Partial<ParteVehiculoDetalle> = {}): ParteVehiculoDetalle {
  return Object.assign(new ParteVehiculoDetalle(), { fk_vehiculo_id: 7 }, cambios);
}

function parteValido(): ParteModel {
  const p = new ParteModel(new Date(2026, 10, 20));
  p.fk_estacion_id = 1;
  p.parte_hora_aviso = '22:05';
  p.parte_descripcion_operaciones = 'Operaciones';
  p.personal = [Object.assign(new PartePersonalDetalle(), { fk_personal_id: 5, parte_personal_rol: ROL_MANDO })];
  p.vehiculos = [vehiculo({ parte_vehiculo_hora_salida: '2026-11-20T22:14', parte_vehiculo_hora_arribo: '2026-11-20T22:20' })];
  return p;
}

describe('partes.model', () => {
  it('niveles del tipo de auxilio como en el formato (clasificación -> subclasificación -> usos)', () => {
    expect(clasificacionesAuxilio(CATALOGO)).toEqual(['Falsa alarma', 'Auxilio']);
    expect(subclasificacionesAuxilio(CATALOGO, 'Falsa alarma')).toEqual([]);
    expect(subclasificacionesAuxilio(CATALOGO, 'Auxilio')).toEqual(['Evacuación', 'General']);
    expect(usosAuxilio(CATALOGO, 'Auxilio', 'Evacuación')).toEqual(['Personas', 'Menaje + personas']);
    expect(usosAuxilio(CATALOGO, 'Auxilio', 'General')).toEqual([]);
    const d = Object.assign(new ParteTipoAuxilioDetalle(), { parte_auxilio_clasificacion: 'Auxilio', parte_auxilio_subclasificacion: 'General' });
    expect(idTipoAuxilio(CATALOGO, d)).toBe(4);
    expect(causasDe([{ causa_id: 1, clasificacion: 'Rescate', descripcion: 'Caída' }], 'Rescate')).toEqual(['Caída']);
  });

  it('tiempo de respuesta: aviso -> primer arribo', () => {
    const p = parteValido();
    expect(minutosRespuesta(p)).toBe(15);
    p.vehiculos.push(vehiculo({ fk_vehiculo_id: 8, parte_vehiculo_hora_arribo: '2026-11-20T22:12' }));
    expect(minutosRespuesta(p)).toBe(7);
    p.parte_fecha_aviso = '2026-11-21';
    expect(minutosRespuesta(p)).withContext('arribo antes del aviso: incoherente').toBeNull();
    p.parte_hora_aviso = '';
    expect(minutosRespuesta(p)).toBeNull();
  });

  it('km recorridos y hora de despacho sugerida', () => {
    expect(kmRecorridos(vehiculo({ parte_vehiculo_km_salida: 23337, parte_vehiculo_km_retorno: 23343 }))).toBe(6);
    expect(kmRecorridos(vehiculo({ parte_vehiculo_km_salida: 100, parte_vehiculo_km_retorno: 90 }))).toBeNull();
    expect(kmRecorridos(vehiculo({ parte_vehiculo_km_salida: 100 }))).toBeNull();
    expect(fechaHoraAviso({ parte_fecha: '2026-11-20', parte_fecha_aviso: '', parte_hora_aviso: '22:05' })).toBe('2026-11-20T22:05');
    expect(fechaHoraAviso({ parte_fecha: '2026-11-20', parte_fecha_aviso: '', parte_hora_aviso: '' })).toBe('');
  });

  it('validación antes de enviar', () => {
    expect(validarParte(parteValido(), '2026-11-22')).toEqual([]);
    const p = parteValido();
    p.parte_fecha = '2026-11-23';
    p.personal[0].parte_personal_rol = 'PERSONAL OPERATIVO';
    p.vehiculos[0].parte_vehiculo_km_salida = 100;
    p.vehiculos[0].parte_vehiculo_km_retorno = 90;
    p.vehiculos[0].parte_vehiculo_hora_arribo = '2026-11-20T22:00';
    const errores = validarParte(p, '2026-11-22');
    expect(errores).toContain('La fecha del parte no puede ser futura.');
    expect(errores).toContain('Indique una (y solo una) persona al mando de la emergencia.');
    expect(errores.some(e => e.includes('km de ingreso'))).toBeTrue();
    expect(errores.some(e => e.includes('en orden'))).toBeTrue();
    const sinVehiculo = parteValido();
    sinVehiculo.vehiculos = [new ParteVehiculoDetalle()];
    expect(validarParte(sinVehiculo, '2026-11-22')).toContain('Registre al menos un vehículo.');
  });
});
