import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AuthService } from '../../../auth/auth.service';
import { PdfService } from '../../../core/pdf.service';
import { PersonalService } from '../../../tthh/services/personal.service';
import { PeticionMaterialesService } from '../../services/peticion-materiales.service';
import { PeticionMaterialesFormComponent } from './peticion-materiales-form.component';

describe('PeticionMaterialesFormComponent', () => {
  const config = { unidades: ['CAJA'], autoriza: { ppersonal_id: 44, nombre_completo: 'DIRECTOR', puesto_nombre: 'DIRECTOR ADMINISTRATIVO' }, ciudad: 'Santo Domingo' };

  function crear(id: string, servicio: Record<string, unknown> = {}) {
    TestBed.configureTestingModule({
      imports: [PeticionMaterialesFormComponent],
      providers: [provideRouter([]), provideNoopAnimations(),
        { provide: PeticionMaterialesService, useValue: { getConfig: () => of(config), getById: () => of(null), urlPdf: (i: number) => `pdf?id=${i}`, ...servicio } },
        { provide: PersonalService, useValue: { getTodos: () => of([{ ppersonal_id: 7, nombre_completo: 'ANA', puesto_nombre: 'ANALISTA' }]) } },
        { provide: PdfService, useValue: { abrir: jasmine.createSpy() } },
        { provide: AuthService, useValue: { tienePermiso: () => true } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } }],
    });
    const f = TestBed.createComponent(PeticionMaterialesFormComponent);
    f.detectChanges();
    return f.componentInstance;
  }

  it('nueva: lugar = ciudad, autoriza el puesto configurado y 3 filas para digitar', () => {
    const c = crear('nuevo');
    expect(c.datos.peticion_lugar).toBe('Santo Domingo');
    expect(c.datos.autoriza_id).toBe(44);
    expect(c.datos.autoriza_cargo).toBe('DIRECTOR ADMINISTRATIVO');
    expect(c.datos.detalle.length).toBe(3);
  });

  it('el cargo se propone con el puesto de la persona elegida', () => {
    const c = crear('nuevo');
    c.alElegirPersona('solicitante', { ppersonal_id: 7, nombre_completo: 'ANA', puesto_nombre: 'ANALISTA' } as any);
    expect(c.datos.solicitante_cargo).toBe('ANALISTA');
  });

  it('filas: agregar y quitar (siempre queda una)', () => {
    const c = crear('nuevo');
    c.agregarFila();
    expect(c.datos.detalle.length).toBe(4);
    [3, 2, 1, 0].forEach(i => c.quitarFila(i));
    expect(c.datos.detalle.length).toBe(1);
  });

  it('guarda solo las filas llenas', () => {
    const guardar = jasmine.createSpy().and.returnValue(of({ msg: 'ok', id: 1, peticion_codigo: 'CBSD26PDM00001' }));
    const c = crear('nuevo', { guardar });
    c.datos.peticion_destino = 'Estación 1';
    c.datos.solicitante_id = 7;
    c.datos.detalle[1] = { detalle_cantidad: 2, detalle_unidad: 'caja', detalle_descripcion: 'Guantes' };
    c.guardar();
    expect(guardar.calls.mostRecent().args[0].detalle).toEqual([{ detalle_cantidad: 2, detalle_unidad: 'CAJA', detalle_descripcion: 'Guantes' }]);
  });

  it('anulada: solo lectura', () => {
    const c = crear('5', { getById: () => of({ peticion_id: 5, peticion_codigo: 'X', peticion_estado: 'ANULADA', peticion_fecha: '2026-01-01', detalle: [] }) });
    expect(c.puedeEditar).toBeFalse();
  });
});
