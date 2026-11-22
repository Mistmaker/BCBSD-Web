import { erroresPeticion, itemEnBlanco, itemVacio, PeticionGuardar, peticionParaGuardar, textoAutorizadoPara } from './peticion-materiales.model';

const base = (extra: Partial<PeticionGuardar> = {}): PeticionGuardar => ({
  peticion_fecha: '2026-11-22', peticion_lugar: 'Santo Domingo', peticion_destino: 'Estación 1', peticion_autorizado_para: null, solicitante_id: 5,
  solicitante_cargo: '', autoriza_id: null, autoriza_cargo: '', peticion_observaciones: '',
  detalle: [{ detalle_cantidad: 3, detalle_unidad: ' caja ', detalle_descripcion: ' Guantes ' }, itemVacio()], ...extra,
});

describe('peticion-materiales.model', () => {
  it('fila en blanco', () => {
    expect(itemEnBlanco(itemVacio())).toBeTrue();
    expect(itemEnBlanco({ detalle_cantidad: null, detalle_unidad: '', detalle_descripcion: 'x' })).toBeFalse();
  });

  it('válida: ignora filas en blanco y normaliza al guardar', () => {
    expect(erroresPeticion(base())).toEqual([]);
    expect(peticionParaGuardar(base()).detalle).toEqual([{ detalle_cantidad: 3, detalle_unidad: 'CAJA', detalle_descripcion: 'Guantes' }]);
  });

  it('errores como el API', () => {
    expect(erroresPeticion(base({ peticion_destino: ' ' }))).toContain('Indique en qué se utilizarán los materiales');
    expect(erroresPeticion(base({ solicitante_id: null }))).toContain('Seleccione al solicitante');
    expect(erroresPeticion(base({ detalle: [itemVacio()] }))).toContain('Agregue al menos un material');
    expect(erroresPeticion(base({ detalle: [itemVacio(), { detalle_cantidad: 0, detalle_unidad: 'U', detalle_descripcion: 'X' }] })))
      .toEqual(['Ítem 2: la cantidad debe ser mayor a 0']);
    expect(erroresPeticion(base({ detalle: [{ detalle_cantidad: 1, detalle_unidad: '', detalle_descripcion: 'X' }] })))
      .toEqual(['Ítem 1: ingrese la unidad y la descripción']);
  });

  it('texto de "autorizado para"', () => {
    expect(textoAutorizadoPara('ADQUISICION')).toBe('Adquisición');
    expect(textoAutorizadoPara('BODEGA')).toBe('Bodega');
    expect(textoAutorizadoPara(null)).toBe('Sin definir');
  });
});
