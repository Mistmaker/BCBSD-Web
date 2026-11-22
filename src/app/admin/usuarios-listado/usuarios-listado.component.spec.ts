import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { UsuarioModel } from '../models/usuarios.model';
import { AdminService } from '../services/admin.service';
import { filtrarUsuarios, UsuariosListadoComponent } from './usuarios-listado.component';

const u = (id: number, extra: Partial<UsuarioModel>): UsuarioModel =>
  ({ usuario_id: id, usuario_estado: 'ACTIVO', fk_perfil_id: 1, perfil_nombre: 'ANALISTA', es_funcionario: true, ...extra } as UsuarioModel);

describe('UsuariosListadoComponent', () => {
  const lista = [u(1, {}), u(2, { usuario_estado: 'INACTIVO' }), u(3, { es_funcionario: false, fk_perfil_id: 2, perfil_nombre: 'EXTERNO' })];

  it('filtra por estado, vínculo y perfil', () => {
    expect(filtrarUsuarios(lista, 'ACTIVO', null).map(x => x.usuario_id)).toEqual([1, 3]);
    expect(filtrarUsuarios(lista, 'INACTIVO', null).map(x => x.usuario_id)).toEqual([2]);
    expect(filtrarUsuarios(lista, 'EXTERNOS', null).map(x => x.usuario_id)).toEqual([3]);
    expect(filtrarUsuarios(lista, 'FUNCIONARIOS', null).map(x => x.usuario_id)).toEqual([1, 2]);
    expect(filtrarUsuarios(lista, 'TODOS', 1).map(x => x.usuario_id)).toEqual([1, 2]);
  });

  it('carga los usuarios y agrupa los perfiles para el filtro', () => {
    TestBed.configureTestingModule({
      imports: [UsuariosListadoComponent],
      providers: [provideRouter([]), { provide: AdminService, useValue: { getAll: () => of(lista) } },
                  { provide: AuthService, useValue: { tienePermiso: () => true } }],
    });
    const f = TestBed.createComponent(UsuariosListadoComponent);
    f.detectChanges();
    expect(f.componentInstance.perfiles).toEqual([{ id: 1, nombre: 'ANALISTA', cantidad: 2 }, { id: 2, nombre: 'EXTERNO', cantidad: 1 }]);
    expect(f.nativeElement.querySelectorAll('tbody tr').length).toBe(2); // activos por defecto
  });
});
