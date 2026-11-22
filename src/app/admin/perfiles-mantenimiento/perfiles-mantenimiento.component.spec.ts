import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../services/admin.service';
import { PerfilesMantenimientoComponent } from './perfiles-mantenimiento.component';

describe('PerfilesMantenimientoComponent', () => {
  function crear(id: string, servicio: Partial<Record<keyof AdminService, unknown>>) {
    TestBed.configureTestingModule({
      imports: [PerfilesMantenimientoComponent],
      providers: [provideRouter([]), { provide: AdminService, useValue: servicio },
                  { provide: AuthService, useValue: { tienePermiso: () => true, refrescarPermisos: () => of({}) } },
                  { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } }],
    });
    const f = TestBed.createComponent(PerfilesMantenimientoComponent);
    f.detectChanges();
    return f.componentInstance;
  }

  it('perfil nuevo: árbol sin marcar; guarda nombre y roles marcados', async () => {
    const arbol = [{ modulo_id: 1, modulo_nombre: 'M', submodulos: [{ submodulo_id: 1, submodulo_nombre: 'S', roles: [
      { rol_id: 9, rol_nombre: 'R', rol_descripcion: null, rol_path: '/x', rol_codigo: 'X', tipo: 'ACCESO', asignado: false, del_perfil: false }] }] }];
    const guardarPerfil = jasmine.createSpy().and.returnValue(of({ msg: 'ok', id: 1 }));
    const c = crear('nuevo', { getArbolPrivilegios: () => of(arbol), guardarPerfil });
    expect(c.arbol.length).toBe(1);
    c.nombre = 'analista';
    c.arbol[0].submodulos[0].roles[0].asignado = true;
    c.guardar();
    await new Promise(r => setTimeout(r)); // la confirmación es una promesa
    expect(guardarPerfil).toHaveBeenCalledWith(jasmine.objectContaining({ perfil_nombre: 'analista', roles: [9], perfil_estado: 'ACTIVO' }));
  });

  it('exige el nombre', () => {
    const guardarPerfil = jasmine.createSpy();
    const c = crear('nuevo', { getArbolPrivilegios: () => of([]), guardarPerfil });
    c.nombre = ' x ';
    c.guardar();
    expect(guardarPerfil).not.toHaveBeenCalled();
  });
});
