import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../services/admin.service';
import { PerfilesListadoComponent } from './perfiles-listado.component';

describe('PerfilesListadoComponent', () => {
  it('lista los perfiles y muestra "Nuevo perfil" solo con privilegio', () => {
    const perfiles = [{ perfil_id: 1, perfil_nombre: 'ADMINISTRADOR', perfil_descripcion: null, perfil_estado: 'ACTIVO', usuarios: 2, usuarios_activos: 2, privilegios: 5, pantallas: 2 }];
    let permiso = false;
    TestBed.configureTestingModule({
      imports: [PerfilesListadoComponent],
      providers: [provideRouter([]), { provide: AdminService, useValue: { getPerfiles: () => of(perfiles) } },
                  { provide: AuthService, useValue: { tienePermiso: () => permiso } }],
    });
    const f = TestBed.createComponent(PerfilesListadoComponent);
    f.detectChanges();
    const texto = f.nativeElement.textContent as string;
    expect(texto).toContain('ADMINISTRADOR');
    expect(texto).toContain('2 pantalla(s) · 3 acción(es)');
    expect(texto).not.toContain('Nuevo perfil');
    permiso = true;
    f.detectChanges();
    expect(f.nativeElement.textContent).toContain('Nuevo perfil');
  });
});
