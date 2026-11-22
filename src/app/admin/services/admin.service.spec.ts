import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminService } from './admin.service';
import { environment } from '../../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let http: HttpTestingController;
  const admin = `${environment.API_URL}/servicios/admin`;
  const auth = `${environment.API_URL}/servicios/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AdminService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('usuarios: listado, uno y búsqueda por documento', () => {
    service.getAll().subscribe();
    http.expectOne(`${admin}/getUsuarios.php`).flush([]);
    service.getById(5).subscribe();
    http.expectOne(`${admin}/getUsuarios.php?id=5`).flush({});
    service.buscarPersona('1712345675').subscribe();
    http.expectOne(`${admin}/getPersonaUsuario.php?doc=1712345675`).flush({});
  });

  it('guardar usuario: POST nuevo, PUT existente; claves', () => {
    const datos = { persona_nombres: 'A', persona_apellidos: 'B', persona_correo: '', persona_celular: '', usuario_login: 'ab1', fk_perfil_id: 1, usuario_estado: 'ACTIVO' as const };
    service.guardarUsuario(datos).subscribe();
    expect(http.expectOne(`${admin}/setUsuario.php`).request.method).toBe('POST');
    service.guardarUsuario({ ...datos, usuario_id: 3 }).subscribe();
    expect(http.expectOne(`${admin}/setUsuario.php`).request.method).toBe('PUT');
    service.restablecerClave(3, 'Nueva2026x').subscribe();
    expect(http.expectOne(`${admin}/setClaveUsuario.php`).request.body).toEqual({ usuario_id: 3, clave: 'Nueva2026x' });
    service.cambiarMiClave('Vieja2026x', 'Nueva2026x').subscribe();
    expect(http.expectOne(`${admin}/setClaveUsuario.php`).request.body).toEqual({ clave_actual: 'Vieja2026x', clave: 'Nueva2026x' });
  });

  it('privilegios adicionales y perfiles', () => {
    service.getPrivilegios(3).subscribe();
    http.expectOne(`${auth}/getPrivilegios.php?id=3`).flush([]);
    service.guardarPrivilegios(3, [1, 2]).subscribe();
    expect(http.expectOne(`${auth}/setPrivilegios.php`).request.body).toEqual({ usuario_id: 3, roles: [1, 2] });
    service.getPerfiles().subscribe();
    http.expectOne(`${admin}/getPerfiles.php`).flush([]);
    service.getPerfil(7).subscribe();
    http.expectOne(`${admin}/getPerfiles.php?id=7`).flush({});
    service.getArbolPrivilegios().subscribe();
    http.expectOne(`${admin}/getPerfiles.php?arbol=1`).flush([]);
    service.guardarPerfil({ perfil_nombre: 'X', perfil_descripcion: '', perfil_estado: 'ACTIVO', roles: [] }).subscribe();
    expect(http.expectOne(`${admin}/setPerfil.php`).request.method).toBe('POST');
    service.guardarPerfil({ perfil_id: 7, perfil_nombre: 'X', perfil_descripcion: '', perfil_estado: 'ACTIVO', roles: [] }).subscribe();
    expect(http.expectOne(`${admin}/setPerfil.php`).request.method).toBe('PUT');
  });
});
