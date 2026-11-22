import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { IconSetService } from '@coreui/icons-angular';

import { DefaultLayoutComponent } from './default-layout.component';
import { AuthService } from '../../auth/auth.service';

describe('DefaultLayoutComponent (menú)', () => {
  let auth: any;
  let menu: any[];

  beforeEach(() => {
    menu = [{ name: 'Dir. Administrativa', url: '/admin', children: [{ name: 'Combustible', url: '/admin/ordenes-abastecimiento' }] }];
    auth = {
      privilegiosCambiados$: new Subject<void>(),
      getUsuario: () => ({ token: 't', usuario: { usuario_id: 5 } }),
      getMenus: jasmine.createSpy('getMenus').and.callFake(() => of(menu)),
      refrescarPermisos: jasmine.createSpy('refrescarPermisos').and.returnValue(of(undefined)),
    };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations(), IconSetService, { provide: AuthService, useValue: auth }]
    });
    TestBed.overrideComponent(DefaultLayoutComponent, { set: { template: '' } });
  });

  it('arma el menú solo con lo que devuelve el API (sin el menú de ejemplo)', () => {
    const c = TestBed.createComponent(DefaultLayoutComponent).componentInstance;
    expect(c.navItems).toEqual(menu);
    expect(auth.refrescarPermisos).toHaveBeenCalled();
  });

  it('recarga el menú y los permisos cuando cambian los privilegios', () => {
    const c = TestBed.createComponent(DefaultLayoutComponent).componentInstance;
    menu = [];
    auth.privilegiosCambiados$.next();
    expect(auth.getMenus).toHaveBeenCalledTimes(2);
    expect(auth.refrescarPermisos).toHaveBeenCalledTimes(2);
    expect(c.navItems).toEqual([]);
  });
});
