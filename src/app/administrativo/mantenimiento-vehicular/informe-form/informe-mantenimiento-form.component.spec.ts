import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { InformeMantenimientoFormComponent } from './informe-mantenimiento-form.component';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { PersonalService } from '../../../tthh/services/personal.service';
import { InformeMantenimientoModel, OrdenMantenimientoModel } from '../../models/mantenimiento.model';

describe('InformeMantenimientoFormComponent', () => {
  let mant: jasmine.SpyObj<MantenimientoService>;
  const orden = (id: number, total = 0) => Object.assign(new OrdenMantenimientoModel(), { orden_id: id, orden_codigo: 'O' + id, total_facturas: total });

  function crear(id: string) {
    TestBed.configureTestingModule({
      imports: [InformeMantenimientoFormComponent],
      providers: [
        provideRouter([]),
        { provide: MantenimientoService, useValue: mant },
        { provide: PersonalService, useValue: { getAll: () => of([]) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
      ]
    });
    const f = TestBed.createComponent(InformeMantenimientoFormComponent);
    f.detectChanges();
    return f.componentInstance;
  }

  beforeEach(() => {
    mant = jasmine.createSpyObj<MantenimientoService>('MantenimientoService', ['getOrdenes', 'getInforme', 'guardarInforme']);
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
