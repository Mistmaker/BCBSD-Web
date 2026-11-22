import { AuthService } from '../../../auth/auth.service';
import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { InformeMantenimientoFormComponent } from './informe-mantenimiento-form.component';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { PersonalService } from '../../../tthh/services/personal.service';
import { PdfService } from '../../../core/pdf.service';
import { InformeMantenimientoModel, OrdenMantenimientoModel } from '../../models/mantenimiento.model';

describe('InformeMantenimientoFormComponent', () => {
  let mant: jasmine.SpyObj<MantenimientoService>;
  const orden = (id: number, total = 0) => Object.assign(new OrdenMantenimientoModel(), { orden_id: id, orden_codigo: 'O' + id, total_facturas: total });

  function crear(id: string) {
    TestBed.configureTestingModule({
      imports: [InformeMantenimientoFormComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { tienePermiso: () => true, getUsuario: () => ({}) } },
        { provide: MantenimientoService, useValue: mant },
        { provide: PersonalService, useValue: { getAll: () => of([]) } },
        { provide: PdfService, useValue: jasmine.createSpyObj<PdfService>('PdfService', ['abrir']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
      ]
    });
    const f = TestBed.createComponent(InformeMantenimientoFormComponent);
    f.detectChanges();
    return f.componentInstance;
  }

  beforeEach(() => {
    mant = jasmine.createSpyObj<MantenimientoService>('MantenimientoService', ['getOrdenes', 'getInforme', 'guardarInforme', 'getConfiguracion', 'getSiguienteNumeroInforme', 'getContratos']);
    mant.getContratos.and.returnValue(of([{ contrato_id: 20, contrato_codigo: 'C-20', contrato_taller: 'TALLER 20', contrato_estado: 'VIGENTE', partidas: [], vehiculos: [] } as any]));
    mant.getConfiguracion.and.returnValue(of({ sistema_nombre: '', sistema_siglas: 'CBSD', director_administrativo: { ppersonal_id: 44, nombre_completo: 'D' },
      parametros: [{ param_key: 'MANT_CARGOS_RESPONSABLE', param_value: 'ADMINISTRADOR DE LA ORDEN DE COMPRA|OTRO', param_name: '' }] }));
    mant.getOrdenes.and.returnValue(of([orden(2, 50), orden(3, 25)]));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  });

  it('al editar muestra las órdenes incluidas seleccionadas más las libres', () => {
    mant.getInforme.and.returnValue(of(Object.assign(new InformeMantenimientoModel(), { informe_id: 1, ordenes_detalle: [orden(1, 100)] })));
    const c = crear('1');
    expect(mant.getOrdenes).toHaveBeenCalledWith({ sin_informe: true });
    expect(c.disponibles.map(o => o.orden_id)).toEqual([1, 2, 3]);
    expect([...c.seleccionadas]).toEqual([1]);
    c.alternar(3);
    expect(c.totalSeleccionado).toBe(125);
  });

  it('bitácora nueva: precarga director y cargo; +1 sugiere el número', () => {
    mant.getSiguienteNumeroInforme.and.returnValue(of({ informe_numero: 'CBSD26INF00002', informe_serie: 2 }));
    const c = crear('nuevo');
    expect(c.informe.director_administrativo).toBe(44);
    expect(c.informe.tecnico_cargo).toBe('ADMINISTRADOR DE LA ORDEN DE COMPRA');
    c.siguienteNumero();
    expect(c.informe.informe_numero).toBe('CBSD26INF00002');
  });

  it('filtra las órdenes sin ocultar las seleccionadas', () => {
    mant.getOrdenes.and.returnValue(of([
      Object.assign(orden(2), { vehiculo_sigla: 'M-04', orden_serie: 5 }),
      Object.assign(orden(3), { vehiculo_sigla: 'M-06', orden_serie: 1 }),
    ]));
    const c = crear('nuevo');
    c.alternar(3);
    c.filtro = '005';
    expect(c.ordenesFiltradas.map(o => o.orden_id)).toEqual([2, 3]);
    c.filtro = 'm-04';
    expect(c.ordenesFiltradas.map(o => o.orden_id)).toEqual([2, 3]);
    c.alternar(3);
    expect(c.ordenesFiltradas.map(o => o.orden_id)).toEqual([2]);
  });

  it('al elegir el contrato filtra sus órdenes, usa su taller y quita selecciones de otros contratos', () => {
    mant.getOrdenes.and.returnValue(of([Object.assign(orden(2), { fk_contrato_id: 20 }), Object.assign(orden(3), { fk_contrato_id: 21 })]));
    mant.getSiguienteNumeroInforme.and.returnValue(of({ informe_numero: 'BITÁCORA 01-MANTENIMIENTO MOTOCICLETAS C-20', informe_serie: 0 }));
    const c = crear('nuevo');
    c.alternar(3);
    c.informe.fk_contrato_id = 20;
    c.alCambiarContrato();
    expect(c.disponibles.map(o => o.orden_id)).toEqual([2]);
    expect([...c.seleccionadas]).toEqual([]);
    expect(c.informe.informe_taller).toBe('TALLER 20');
    c.siguienteNumero();
    expect(mant.getSiguienteNumeroInforme).toHaveBeenCalledWith(20);
    expect(c.informe.informe_numero).toBe('BITÁCORA 01-MANTENIMIENTO MOTOCICLETAS C-20');
  });

  it('exige al menos una orden', () => {
    const c = crear('nuevo');
    c.guardar({ invalid: false } as any);
    expect(mant.guardarInforme).not.toHaveBeenCalled();
  });

  it('envía los ids seleccionados', () => {
    mant.guardarInforme.and.returnValue(of({ msg: 'Informe guardado', id: 9, informe_numero: 'CBSD26INF00001' }));
    const c = crear('nuevo');
    c.alternar(2);
    c.alternar(3);
    c.alternar(3);
    c.guardar({ invalid: false } as any);
    expect(mant.guardarInforme.calls.mostRecent().args[0].ordenes).toEqual([2]);
  });

  it('anular envía estado ANULADO aunque el formulario esté incompleto', () => {
    mant.guardarInforme.and.returnValue(of({ msg: 'Informe guardado', id: 1 }));
    const c = crear('nuevo');
    c.guardar({ invalid: true } as any, true);
    expect(mant.guardarInforme.calls.mostRecent().args[0].informe_estado).toBe('ANULADO');
  });
});
