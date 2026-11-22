import { cedulaValida, colorVigencia, diasParaVencer, errorArchivoPdf, filtrarOperadores, nombreArchivoLicencia, OperadorModel, textoLicencia } from './operadores.model';
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

  it('filtra los que no tienen el PDF de la licencia', () => {
    const lista = [op(1, { tiene_sustento: true }), op(2, { tiene_sustento: false })];
    expect(filtrarOperadores(lista, 'SIN SUSTENTO').map(o => o.conductor_id)).toEqual([2]);
  });

  it('nombre del archivo de la licencia igual que el API', () => {
    expect(nombreArchivoLicencia('c1', '1712345675')).toBe('LIC-C1-1712345675.pdf');
    expect(nombreArchivoLicencia(' E ', '1712345675')).toBe('LIC-E-1712345675.pdf');
  });

  it('valida el PDF antes de subirlo', () => {
    const pdf = (nombre: string, tipo: string, tam: number) => new File([new Uint8Array(tam)], nombre, { type: tipo });
    expect(errorArchivoPdf(null, 5)).toBeNull();
    expect(errorArchivoPdf(pdf('lic.pdf', 'application/pdf', 2048), 5)).toBeNull();
    expect(errorArchivoPdf(pdf('lic.jpg', 'image/jpeg', 2048), 5)).toContain('PDF');
    expect(errorArchivoPdf(pdf('lic.pdf', 'application/pdf', 6 * 1024 * 1024), 5)).toContain('5 MB');
    expect(errorArchivoPdf(pdf('lic.pdf', 'application/pdf', 10), 5)).toContain('vacío');
  });

  it('sugiere 5 años de validez', () => {
    expect(validezSugerida('2024-03-15')).toBe('2029-03-15');
  });
});
