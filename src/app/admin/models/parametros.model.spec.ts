import {
  filtrarParametros, formatearJson, jsonATabla, listaDesdeTexto, ParametroModel, resumenValor, tablaAJson, validarParametro, validarTabla
} from './parametros.model';

describe('parametros.model', () => {
  it('lista desde el texto separado por |', () => {
    expect(listaDesdeTexto(' A | B ||C ')).toEqual(['A', 'B', 'C']);
    expect(listaDesdeTexto(null)).toEqual([]);
  });

  it('valida como el API', () => {
    expect(validarParametro('NUMERO', '1,5')).toBeNull();
    expect(validarParametro('NUMERO', '')).toBeNull();
    expect(validarParametro('NUMERO', '12a')).toContain('número');
    expect(validarParametro('TEXTO', 'a\nb')).toContain('una sola línea');
    expect(validarParametro('LISTA', ['A', 'a'])).toContain('repetido');
    expect(validarParametro('LISTA', ['A|B'])).toContain('|');
    expect(validarParametro('LISTA', ['A', 'B'])).toBeNull();
    expect(validarParametro('SI_NO', 'si')).toBeNull();
    expect(validarParametro('SI_NO', 'tal vez')).toContain('SI o NO');
    expect(validarParametro('COLOR', '#d32f2f')).toBeNull();
    expect(validarParametro('COLOR', 'rojo')).toContain('#RRGGBB');
    expect(validarParametro('JSON', '{"a":')).toContain('JSON inválido');
    expect(validarParametro('JSON', ' ')).toContain('vacío');
    expect(validarParametro('HTML', '<b>')).toBeNull();
  });

  it('JSON en tabla: objeto y arreglo de valores simples, conservando los tipos', () => {
    const t = jsonATabla('{"BACHILLER":"Bachiller","NIVEL":3,"ACTIVO":true}')!;
    expect(t.forma).toBe('objeto');
    expect(t.filas.map(f => [f.clave, f.valor, f.tipo])).toEqual([['BACHILLER', 'Bachiller', 'string'], ['NIVEL', '3', 'number'], ['ACTIVO', 'true', 'boolean']]);
    t.filas[1].valor = '4';
    t.filas.push({ clave: 'NUEVO', valor: 'x', tipo: 'string' });
    expect(JSON.parse(tablaAJson(t))).toEqual({ BACHILLER: 'Bachiller', NIVEL: 4, ACTIVO: true, NUEVO: 'x' });
    const a = jsonATabla('["INICIANDO","EN CURSO"]')!;
    expect(a.forma).toBe('arreglo');
    a.filas.splice(0, 1);
    expect(JSON.parse(tablaAJson(a))).toEqual(['EN CURSO']);
    expect(jsonATabla('{"a":{"b":1}}')).toBeNull();
    expect(jsonATabla('5')).toBeNull();
    expect(jsonATabla('{')).toBeNull();
  });

  it('valida claves del objeto', () => {
    expect(validarTabla({ forma: 'objeto', filas: [{ clave: 'A', valor: '', tipo: 'string' }, { clave: ' A', valor: '', tipo: 'string' }] })).toContain('repetida');
    expect(validarTabla({ forma: 'objeto', filas: [{ clave: '', valor: 'x', tipo: 'string' }] })).toContain('sin clave');
    expect(validarTabla({ forma: 'arreglo', filas: [] })).toBeNull();
  });

  it('formatea JSON y resume valores', () => {
    expect(formatearJson('{"a":1}')).toBe('{\n  "a": 1\n}');
    expect(formatearJson('{x')).toBe('{x');
    expect(resumenValor({ param_type: 'JSON', param_value: '{\n  "a": 1\n}' })).toBe('{"a":1}');
    expect(resumenValor({ param_type: 'TEXTO_LARGO', param_value: 'x'.repeat(200) }, 10)).toBe('xxxxxxxxx…');
  });

  it('busca por llave, nombre o valor sin tildes y filtra por módulo', () => {
    const p = (key: string, name: string, value: string, modulo: string) =>
      ({ param_key: key, param_name: name, param_value: value, param_modulo: modulo } as ParametroModel);
    const lista = [p('MANT_RUBROS', 'Rubros presupuestarios', 'MANO DE OBRA', 'MANTENIMIENTO'), p('MAPA_ZOOM', 'Zoom de la imagen de ubicación', '17', 'MAPAS')];
    expect(filtrarParametros(lista, 'ubicacion', '').map(x => x.param_key)).toEqual(['MAPA_ZOOM']);
    expect(filtrarParametros(lista, 'mano obra', '').map(x => x.param_key)).toEqual(['MANT_RUBROS']);
    expect(filtrarParametros(lista, '', 'MAPAS').length).toBe(1);
    expect(filtrarParametros(lista, 'mant', 'MAPAS').length).toBe(0);
  });
});
