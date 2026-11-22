import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import Swal from 'sweetalert2';

import { permisoGuard } from './permiso.guard';
import { AuthService } from './auth.service';

describe('permisoGuard', () => {
  let auth: jasmine.SpyObj<AuthService>;
  const ejecutar = (permiso?: string | string[]) => TestBed.runInInjectionContext(() =>
    permisoGuard({ data: permiso ? { permiso } : {} } as unknown as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['tienePermiso']);
    spyOn(Swal, 'fire');
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: AuthService, useValue: auth }] });
  });

  it('deja pasar si la ruta no exige privilegio', () => {
    expect(ejecutar()).toBeTrue();
    expect(auth.tienePermiso).not.toHaveBeenCalled();
  });

  it('deja pasar con el privilegio', () => {
    auth.tienePermiso.and.returnValue(true);
    expect(ejecutar(['MANT_ORDENES', 'X'])).toBeTrue();
    expect(auth.tienePermiso).toHaveBeenCalledWith('MANT_ORDENES', 'X');
  });

  it('sin el privilegio redirige al dashboard y avisa', () => {
    auth.tienePermiso.and.returnValue(false);
    const r = ejecutar('MANT_CONTRATOS') as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(r)).toBe('/dashboard');
    expect(Swal.fire).toHaveBeenCalled();
  });
});
