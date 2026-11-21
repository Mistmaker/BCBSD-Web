import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { crearTokenPrueba, segundosDesdeAhora } from './testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  const guardarSesion = (sesion: object) => localStorage.setItem('usuario', JSON.stringify(sesion));

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: Router, useValue: router }]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('no está autenticado sin sesión', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('está autenticado con un token vigente', () => {
    guardarSesion({ token: crearTokenPrueba(segundosDesdeAhora(3600)), usuario: { usuario_id: 5 } });
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getUsuarioId()).toBe(5);
  });

  it('rechaza y limpia una sesión con token expirado', () => {
    guardarSesion({ token: crearTokenPrueba(segundosDesdeAhora(-10)), usuario: { usuario_id: 5 } });
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('rechaza una sesión sin token (p. ej. creada a mano en localStorage)', () => {
    guardarSesion({ usuario: { usuario_id: 113, roles: [1] } });
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('rechaza un token mal formado', () => {
    guardarSesion({ token: 'no-es-un-jwt' });
    expect(service.getTokenExpiration()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('lee la expiración del claim exp', () => {
    const exp = segundosDesdeAhora(28800);
    expect(service.getTokenExpiration(crearTokenPrueba(exp))).toBe(exp * 1000);
  });

  it('logout borra la sesión y vuelve al login correspondiente', () => {
    guardarSesion({ token: 'x', usuario: { usuario_id: 1 } });
    service.logout();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);

    guardarSesion({ token: 'x', usuario: { voluntario_id: 3 } });
    service.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/voluntarios']);
  });

  it('getRoles consulta el endpoint correcto', () => {
    service.getRoles(7).subscribe(roles => expect(roles).toEqual([1, 2]));
    http.expectOne(`${environment.API_URL}/servicios/auth/getRoles.php?id=7`).flush([1, 2]);
  });
});
