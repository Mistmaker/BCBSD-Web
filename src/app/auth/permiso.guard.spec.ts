import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, isObservable, Observable, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { permisoGuard } from './permiso.guard';
import { AuthService } from './auth.service';

describe('permisoGuard', () => {
  let auth: jasmine.SpyObj<AuthService>;
  const ejecutar = (permiso?: string | string[], url = '/admin/ordenes-mantenimiento') => TestBed.runInInjectionContext(() =>
    permisoGuard({ data: permiso ? { permiso } : {} } as unknown as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));
  const resolver = async (r: unknown) => isObservable(r) ? firstValueFrom(r as Observable<unknown>) : r;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['tienePermiso', 'tieneAccesoRuta', 'refrescarPermisos']);
    auth.tieneAccesoRuta.and.returnValue(false);
    spyOn(Swal, 'fire');
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: auth }] });
  });

  it('deja pasar si la ruta no exige privilegio', () => {
    expect(ejecutar()).toBeTrue();
    expect(auth.tienePermiso).not.toHaveBeenCalled();
  });

  it('deja pasar con el código del privilegio sin consultar al API', () => {
    auth.tienePermiso.and.returnValue(true);
    expect(ejecutar(['MANT_ORDENES', 'X'])).toBeTrue();
    expect(auth.tienePermiso).toHaveBeenCalledWith('MANT_ORDENES', 'X');
    expect(auth.refrescarPermisos).not.toHaveBeenCalled();
  });

  it('deja pasar si un rol con ruta cubre la URL (regla del menú)', () => {
    auth.tienePermiso.and.returnValue(false);
    auth.tieneAccesoRuta.and.returnValue(true);
    expect(ejecutar('ADM_MOVILIZACION', '/admin/ordenes-movilizacion/5')).toBeTrue();
    expect(auth.tieneAccesoRuta).toHaveBeenCalledWith('/admin/ordenes-movilizacion/5');
  });

  it('privilegio asignado después del login: refresca y deja pasar', async () => {
    let refrescado = false;
    auth.tienePermiso.and.callFake(() => refrescado);
    auth.refrescarPermisos.and.callFake(() => { refrescado = true; return of(undefined); });
    expect(await resolver(ejecutar('ADM_COMBUSTIBLE'))).toBeTrue();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('sin el privilegio, aun después de refrescar, redirige al dashboard y avisa', async () => {
    auth.tienePermiso.and.returnValue(false);
    auth.refrescarPermisos.and.returnValue(of(undefined));
    const r = await resolver(ejecutar('MANT_CONTRATOS')) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(r)).toBe('/dashboard');
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('si falla la consulta al API, niega el acceso', async () => {
    auth.tienePermiso.and.returnValue(false);
    auth.refrescarPermisos.and.returnValue(throwError(() => new Error('red')));
    const r = await resolver(ejecutar('MANT_PLANES')) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(r)).toBe('/dashboard');
  });
});
