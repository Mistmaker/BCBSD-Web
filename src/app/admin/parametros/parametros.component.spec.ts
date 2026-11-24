import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ParametroModel, RespuestaParametros } from '../models/parametros.model';
import { AdminService } from '../services/admin.service';
import { mover, ParametrosComponent } from './parametros.component';

describe('ParametrosComponent', () => {
  const p = (id: number, key: string, tipo: ParametroModel['param_type'], valor: string, modulo = 'MANTENIMIENTO'): ParametroModel =>
    ({ param_id: id, param_key: key, param_name: 'Nombre ' + key, param_value: valor, param_type: tipo, param_modulo: modulo, param_actualizado: null, actualizado_por: null });
  const respuesta = (cambios: Partial<RespuestaParametros> = {}): RespuestaParametros => ({
    parametros: [p(1, 'MANT_RUBROS', 'LISTA', 'MANO DE OBRA|REPUESTOS'), p(2, 'OPER_EXIGIR_PDF', 'SI_NO', 'SI', 'OPERADORES'),
      p(3, 'NIVELES', 'JSON', '{"BACHILLER":"Bachiller"}', 'MAIN'), p(4, 'SIS_ADMINISTRADORES', 'LISTA', '113', 'ADMINISTRACION')],
    tipos: { NUMERO: 'Número', TEXTO: 'Texto simple', TEXTO_LARGO: 'Texto', LISTA: 'Lista', SI_NO: 'Sí / No', JSON: 'JSON', HTML: 'HTML', COLOR: 'Color' },
    modulo_protegido: 'ADMINISTRACION', puede_editar: true, puede_editar_protegidos: false, ...cambios,
  });

  function crear(r = respuesta()) {
    const servicio = {
      getParametros: jasmine.createSpy().and.returnValue(of(r)),
      getHistorialParametro: jasmine.createSpy().and.returnValue(of([])),
      guardarParametro: jasmine.createSpy().and.returnValue(of({ msg: 'ok', param_value: '' })),
    };
    TestBed.configureTestingModule({ imports: [ParametrosComponent], providers: [provideNoopAnimations(), { provide: AdminService, useValue: servicio }] });
    const f = TestBed.createComponent(ParametrosComponent);
    f.detectChanges();
    return { f, c: f.componentInstance, servicio };
  }

  it('lista con valores según el tipo y busca', () => {
    const { f, c } = crear();
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelectorAll('tbody tr').length).toBe(4);
    expect(el.textContent).toContain('REPUESTOS');
    expect(el.textContent).toContain('Sí');
    c.texto.set('mano obra');
    f.detectChanges();
    expect(el.querySelectorAll('tbody tr').length).toBe(1);
    c.texto.set('');
    c.modulo.set('MAIN');
    f.detectChanges();
    expect(el.textContent).toContain('NIVELES');
  });

  it('los de Administración solo los edita un administrador', () => {
    const { c } = crear();
    const [rubros, , , admins] = c.datos()!.parametros;
    expect(c.editable(rubros)).toBeTrue();
    expect(c.editable(admins)).toBeFalse();
    c.datos.set(respuesta({ puede_editar: false }));
    expect(c.editable(rubros)).toBeFalse();
  });

  it('edita una lista: agrega, ordena, quita y envía los elementos', () => {
    const { c, servicio } = crear();
    c.abrir(c.datos()!.parametros[0]);
    expect(c.items).toEqual(['MANO DE OBRA', 'REPUESTOS']);
    c.nuevoItem = 'ACEITES';
    c.agregarItem();
    c.moverItem(2, -1);
    expect(c.items).toEqual(['MANO DE OBRA', 'ACEITES', 'REPUESTOS']);
    c.quitarItem(0);
    c.nuevoItem = 'aceites';
    expect(c.error).toContain('repetido');
    c.nuevoItem = '';
    expect(c.error).toBeNull();
    c.guardar();
    expect(servicio.guardarParametro).toHaveBeenCalledWith(1, ['ACEITES', 'REPUESTOS']);
  });

  it('edita JSON en tabla o como texto', () => {
    const { c, servicio } = crear();
    c.abrir(c.datos()!.parametros[2]);
    expect(c.vistaJson).toBe('tabla');
    c.agregarFila();
    c.tabla!.filas[1].clave = 'TECNICO';
    c.tabla!.filas[1].valor = 'Nivel técnico';
    c.cambiarVistaJson('texto');
    expect(JSON.parse(c.valor)).toEqual({ BACHILLER: 'Bachiller', TECNICO: 'Nivel técnico' });
    c.valor = '{"a":';
    expect(c.error).toContain('JSON inválido');
    c.valor = '{"a":1}';
    c.guardar();
    expect(servicio.guardarParametro).toHaveBeenCalledWith(3, '{"a":1}');
  });

  it('mover no se sale del arreglo', () => {
    expect(mover([1, 2, 3], 0, -1)).toEqual([1, 2, 3]);
    expect(mover([1, 2, 3], 0, 1)).toEqual([2, 1, 3]);
  });
});
