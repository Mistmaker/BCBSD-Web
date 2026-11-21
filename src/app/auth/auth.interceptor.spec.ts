import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import Swal from 'sweetalert2';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('authInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let auth: jasmine.SpyObj<AuthService>;
  const api = environment.API_URL;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'logout']);
    auth.getToken.and.returnValue('token-123');
    spyOn(Swal, 'fire');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth }
      ]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('agrega el encabezado Authorization a las peticiones del API', () => {
    http.get(`${api}/servicios/operaciones/getEstaciones.php`).subscribe();
    const req = backend.expectOne(`${api}/servicios/operaciones/getEstaciones.php`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush([]);
  });

  it('no envía el token a otros dominios', () => {
    http.get('https://tile.openstreetmap.org/1/1/1.png').subscribe();
    const req = backend.expectOne('https://tile.openstreetmap.org/1/1/1.png');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush('');
  });

  it('no envía el token al login', () => {
    http.post(`${api}/servicios/auth/login.php`, {}).subscribe();
    const req = backend.expectOne(`${api}/servicios/auth/login.php`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('no agrega el encabezado si no hay token', () => {
    auth.getToken.and.returnValue(null);
    http.get(`${api}/servicios/x.php`).subscribe();
    const req = backend.expectOne(`${api}/servicios/x.php`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('cierra la sesión cuando el API responde 401', () => {
    let status = 0;
    http.get(`${api}/servicios/x.php`).subscribe({ error: (e) => status = e.status });
    backend.expectOne(`${api}/servicios/x.php`).flush({ error: 'No autorizado' }, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
    expect(auth.logout).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('no cierra la sesión por un 401 del login (credenciales inválidas)', () => {
    http.post(`${api}/servicios/auth/login.php`, {}).subscribe({ error: () => undefined });
    backend.expectOne(`${api}/servicios/auth/login.php`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it('no cierra la sesión por otros errores', () => {
    http.get(`${api}/servicios/x.php`).subscribe({ error: () => undefined });
    backend.expectOne(`${api}/servicios/x.php`).flush({}, { status: 500, statusText: 'Error' });
    expect(auth.logout).not.toHaveBeenCalled();
  });
});
