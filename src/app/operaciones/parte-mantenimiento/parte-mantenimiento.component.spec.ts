import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../../auth/auth.service';
import { IntervencionesService } from '../../subjefatura/services/intervenciones.service';
import { CatalogosParte, ROL_MANDO } from '../models/partes.model';
import { ParteService } from '../services/parte.service';
import { ParteMantenimientoComponent } from './parte-mantenimiento.component';

describe('ParteMantenimientoComponent', () => {
  const catalogos: CatalogosParte = {
    estaciones: [{ estacion_id: 1, estacion_nombre: 'X-1' }],
    vehiculos: [{ vehiculo_id: 7, vehiculo_placa: 'PMA-8597', vehiculo_sigla: 'R-11', vehiculo_tipo: 'AUTOBOMBA', fk_estacion_id: 1 }],
    personal: [{ personal_id: 5, nombre: 'RAMIREZ MIGUEL', persona_apellidos: 'RAMIREZ', persona_nombres: 'MIGUEL', persona_doc_identidad: '1', puesto_nombre: 'BOMBERO', fk_estacion_id: 1 }],
    tipos_auxilio: [{ tipo_auxilio_id: 2, clasificacion: 'Auxilio', subclasificacion: 'Evacuación', uso_tipo: 'Personas' }],
    causas: [{ causa_id: 1, clasificacion: 'Auxilio', descripcion: 'Daño de tubería' }],
    recursos: [{ recurso_id: 1, recurso_tipo: 'EQUIPO', recurso_descripcion: 'EPP ESTRUCTURAL' }],
    formas_aviso: ['Cabina de radio'], apoyos: ['Apoyo interno'], tipos_incendio: [], naturalezas: [],
    rangos: ['Bro. V.'], pelotones: ['Pelotón 1'], claves: ['10-1'], ubicacion: { provincia: 23, canton: 2301, parroquia: 230151 },
  };

  function crear(id: string, permisos: string[], parte: any = null) {
    const servicio = {
      getCatalogos: () => of(catalogos),
      getById: jasmine.createSpy().and.returnValue(of(parte)),
      save: jasmine.createSpy().and.returnValue(of({ msg: 'Parte registrado', id: 1, parte_numero: 'CBSD-PA-X1-2026-0001' })),
      update: jasmine.createSpy().and.returnValue(of({ msg: 'Parte actualizado', id: 1, parte_numero: 'CBSD-PA-X1-2026-0001' })),
      anular: jasmine.createSpy(),
    };
    TestBed.configureTestingModule({
      imports: [ParteMantenimientoComponent],
      providers: [provideRouter([]), provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
        { provide: ParteService, useValue: servicio },
        { provide: IntervencionesService, useValue: { getProvincias: () => of([]), getCantones: () => of([]), getParroquias: () => of([]) } },
        { provide: AuthService, useValue: { tienePermiso: (c: string) => permisos.includes(c) } }],
    });
    const f = TestBed.createComponent(ParteMantenimientoComponent);
    f.detectChanges();
    return { f, c: f.componentInstance, servicio, el: f.nativeElement as HTMLElement };
  }

  it('nuevo: persona al mando y un vehículo listos, ubicación por defecto y número automático', () => {
    const { c, el } = crear('nuevo', ['OPE_PARTE_REGISTRAR']);
    expect(c.parte.personal.length).toBe(1);
    expect(c.parte.personal[0].parte_personal_rol).toBe(ROL_MANDO);
    expect(c.parte.vehiculos.length).toBe(1);
    expect(c.parte.parte_parroquia).toBe(230151);
    expect((el.querySelector('#parte_numero') as HTMLInputElement).value).toBe('Se asigna al guardar');
    c.vehiculoElegido(c.parte.vehiculos[0], catalogos.vehiculos[0]);
    expect(c.parte.vehiculos[0].parte_vehiculo_placa).toBe('PMA-8597');
    expect(c.parte.vehiculos[0].parte_vehiculo_siglas).toBe('R-11');
  });

  it('no envía un parte incompleto y muestra qué corregir', () => {
    const { c, f, servicio } = crear('nuevo', ['OPE_PARTE_REGISTRAR']);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    c.onSubmit({ invalid: false } as any);
    f.detectChanges();
    expect(servicio.save).not.toHaveBeenCalled();
    expect(c.errores).toContain('Seleccione la estación.');
    expect(c.errores).toContain('Registre al menos un vehículo.');
  });

  it('guarda un parte completo', () => {
    const { c, servicio } = crear('nuevo', ['OPE_PARTE_REGISTRAR']);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    Object.assign(c.parte, { fk_estacion_id: 1, parte_hora_aviso: '22:05', parte_descripcion_operaciones: 'Evacuación de menaje', parte_fecha: '2026-01-10' });
    c.parte.personal[0].fk_personal_id = 5;
    c.parte.vehiculos[0].fk_vehiculo_id = 7;
    c.onSubmit({ invalid: false } as any);
    expect(servicio.save).toHaveBeenCalledWith(c.parte);
  });

  it('parte finalizado sin privilegio de supervisión: solo lectura', () => {
    const { c, el } = crear('9', ['OPE_PARTE_REGISTRAR'], {
      parte_id: 9, parte_numero: 'CBSD-PA-X1-2026-0009', parte_estado: 'FINALIZADO', parte_tipo: 'AUXILIO', parte_fecha: '2026-11-20',
      fk_estacion_id: '1', personal: [{ fk_personal_id: 5, parte_personal_rol: ROL_MANDO }], vehiculos: [{ fk_vehiculo_id: 7, parte_vehiculo_km_salida: '10', parte_vehiculo_km_retorno: '16' }],
    });
    expect(c.parte.fk_estacion_id).toBe(1);
    expect(c.parte.vehiculos[0].parte_vehiculo_km_retorno).toBe(16);
    expect(c.soloLectura).toBeTrue();
    expect(el.textContent).toContain('solo la supervisión puede corregirlo');
    expect(el.textContent).not.toContain('Guardar parte');
  });
});
