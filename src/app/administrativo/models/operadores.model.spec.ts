import { cedulaValida, colorVigencia, diasParaVencer, filtrarOperadores, OperadorModel, textoLicencia } from './operadores.model';
import { validezSugerida } from '../operadores/form/operador-form.component';

const op = (id: number, extra: Partial<OperadorModel>): OperadorModel =>
  ({ conductor_id: id, conductor_estado: 'ACTIVO', en_funciones: true, licencia_vigencia: 'VIGENTE', ...extra } as OperadorModel);

describe('operadores.model', () => {
  it('valida la cédula igual que el API', () => {
    expect(cedulaValida('1712345675')).toBeTrue();
    expect(cedulaValida('2301234569')).toBeTrue();
    expect(cedulaValida('1712345670')).toBeFalse(); // verificador
    expect(cedulaValida('2512345678')).toBeFalse(); // provincia
    expect(cedulaValida('1762345675')).toBeFalse(); // tercer dígito
    expect(cedulaValida('171234567')).toBeFalse();
    expect(cedulaValida(null)).toBeFalse();
  });

  it('color y texto de la licencia', () => {
    expect(colorVigencia('VIGENTE')).toBe('success');
    expect(colorVigencia('POR VENCER')).toBe('warning');
    expect(colorVigencia('VENCIDA')).toBe('danger');
    expect(textoLicencia({ licencia_tipo: 'PROFESIONAL', licencia_categoria: 'C' })).toBe('PROFESIONAL C');
    expect(textoLicencia({})).toBe('Sin licencia');
  });

  it('días para vencer', () => {
    const hoy = new Date(2026, 10, 22);
    expect(diasParaVencer('2026-12-22', hoy)).toBe(30);
    expect(diasParaVencer('2026-11-20', hoy)).toBe(-2);
  });

  it('filtra por vigencia e inactivos', () => {
    const lista = [op(1, {}), op(2, { licencia_vigencia: 'VENCIDA' }), op(3, { conductor_estado: 'INACTIVO' }), op(4, { en_funciones: false, licencia_vigencia: 'POR VENCER' })];
    expect(filtrarOperadores(lista, 'TODOS').length).toBe(4);
    expect(filtrarOperadores(lista, 'VIGENTE').map(o => o.conductor_id)).toEqual([1]);
    expect(filtrarOperadores(lista, 'VENCIDA').map(o => o.conductor_id)).toEqual([2]);
    expect(filtrarOperadores(lista, 'POR VENCER').length).toBe(0); // sin funciones va a inactivos
    expect(filtrarOperadores(lista, 'INACTIVOS').map(o => o.conductor_id)).toEqual([3, 4]);
  });

  it('sugiere 5 años de validez', () => {
    expect(validezSugerida('2024-03-15')).toBe('2029-03-15');
  });
});
