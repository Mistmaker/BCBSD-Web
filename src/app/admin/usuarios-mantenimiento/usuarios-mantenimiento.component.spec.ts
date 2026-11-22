import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../services/admin.service';
import { UsuariosMantenimientoComponent } from './usuarios-mantenimiento.component';

describe('UsuariosMantenimientoComponent', () => {
  const perfiles = [{ perfil_id: 1, perfil_nombre: 'SIN PERFIL', perfil_estado: 'ACTIVO' }, { perfil_id: 2, perfil_nombre: 'ANALISTA', perfil_estado: 'ACTIVO' },
                    { perfil_id: 3, perfil_nombre: 'VIEJO', perfil_estado: 'INACTIVO' }];

  function crear(id: string, servicio: Record<string, unknown>) {
    TestBed.configureTestingModule({
      imports: [UsuariosMantenimientoComponent],
      providers: [provideRouter([]),
        { provide: AdminService, useValue: { getPerfiles: () => of(perfiles), getById: () => of(null), getPrivilegios: () => of([]), ...servicio } },
        { provide: AuthService, useValue: { tienePermiso: () => true, getUsuario: () => ({ usuario: { usuario_id: 99 } }), refrescarPermisos: () => of({}) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id })), snapshot: { queryParamMap: convertToParamMap({}) } } }],
    });
    const f = TestBed.createComponent(UsuariosMantenimientoComponent);
    f.detectChanges();
    return f.componentInstance;
  }

  it('nuevo: perfil por defecto SIN PERFIL, solo perfiles activos; busca la cédula al completarla', () => {
    const buscarPersona = jasmine.createSpy().and.returnValue(of({ persona: { persona_id: 1, persona_nombres: 'MARÍA JOSÉ', persona_apellidos: 'PÉREZ GÓMEZ',
      persona_correo: null, persona_celular: null, ppersonal_id: 5, puesto_nombre: 'ANALISTA' }, usuario: null }));
    const c = crear('nuevo', { buscarPersona });
    expect(c.datos.fk_perfil_id).toBe(1);
    expect(c.perfilesElegibles.map(p => p.perfil_id)).toEqual([1, 2]);
    c.datos.persona_doc_identidad = '1712345675';
    c.alCambiarDocumento();
    expect(buscarPersona).toHaveBeenCalledWith('1712345675');
    expect(c.datos.persona_apellidos).toBe('PÉREZ GÓMEZ');
    expect(c.datos.usuario_login).toBe('mperez');
    expect(c.nombresEditables).toBeFalse(); // persona ya registrada
  });

  it('la sugerencia de usuario sigue a nombres y apellidos hasta que se escribe a mano', () => {
    const c = crear('nuevo', { buscarPersona: () => of({ persona: null, usuario: null }) });
    c.datos.persona_doc_identidad = '1712345675';
    c.alCambiarDocumento();
    c.datos.persona_apellidos = 'Zambrano Vera';
    c.sugerirLogin();
    expect(c.datos.usuario_login).toBe('zambrano');
    c.datos.persona_nombres = 'Lucía';
    c.sugerirLogin();
    expect(c.datos.usuario_login).toBe('lzambrano'); // se actualiza al completar el nombre
    c.datos.usuario_login = 'lucia.z';
    c.loginEditado = true;
    c.datos.persona_nombres = 'Ana';
    c.sugerirLogin();
    expect(c.datos.usuario_login).toBe('lucia.z');
  });

  it('valida antes de guardar y envía la clave solo al crear', () => {
    const guardarUsuario = jasmine.createSpy().and.returnValue(of({ msg: 'ok', id: 7 }));
    const c = crear('nuevo', { buscarPersona: () => of({ persona: null, usuario: null }), guardarUsuario });
    c.datos.persona_doc_identidad = '1712345675';
    c.alCambiarDocumento();
    expect(c.errores()).toContain('Ingrese nombres y apellidos');
    c.datos.persona_nombres = 'Ana';
    c.datos.persona_apellidos = 'Externa';
    c.datos.usuario_login = 'aexterna';
    c.datos.clave = 'corta';
    expect(c.errores()).toContain('La clave debe tener al menos 8 caracteres');
    c.generarClave();
    expect(c.errores()).toEqual([]);
    c.guardar();
    expect(guardarUsuario.calls.mostRecent().args[0].clave).toBe(c.datos.clave);
  });

  it('edición: externo puede editar nombres; no puede inactivarse a sí mismo', () => {
    const usuario = { usuario_id: 99, usuario_login: 'yo', usuario_estado: 'ACTIVO', fk_perfil_id: 3, perfil_estado: 'INACTIVO', es_funcionario: false,
                      persona_nombres: 'A', persona_apellidos: 'B' };
    const c = crear('99', { getById: () => of(usuario) });
    expect(c.esNuevo).toBeFalse();
    expect(c.nombresEditables).toBeTrue();
    expect(c.perfilesElegibles.map(p => p.perfil_id)).toEqual([1, 2, 3]); // conserva su perfil aunque esté inactivo
    c.datos.usuario_estado = 'INACTIVO';
    expect(c.errores()).toContain('No puede inactivar su propio usuario');
  });
});
