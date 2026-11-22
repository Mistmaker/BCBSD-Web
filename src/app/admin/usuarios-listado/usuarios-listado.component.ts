import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BadgeComponent, ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormSelectDirective,
  RowComponent, SpinnerComponent, TableDirective } from '@coreui/angular';
import Swal from 'sweetalert2';

import { AuthService } from '../../auth/auth.service';
import { FiltroGeneralPipe } from '../../pipes/filtro-general.pipe';
import { nombrePersona, UsuarioModel } from '../models/usuarios.model';
import { AdminService } from '../services/admin.service';

export type FiltroUsuarios = 'TODOS' | 'ACTIVO' | 'INACTIVO' | 'FUNCIONARIOS' | 'EXTERNOS';

export function filtrarUsuarios(lista: UsuarioModel[], estado: FiltroUsuarios, perfilId: number | null): UsuarioModel[] {
  return lista.filter(u =>
    (perfilId === null || u.fk_perfil_id === perfilId)
    && (estado === 'TODOS' || (estado === 'FUNCIONARIOS' ? u.es_funcionario : estado === 'EXTERNOS' ? !u.es_funcionario : u.usuario_estado === estado)));
}

@Component({
  selector: 'app-usuarios-listado',
  imports: [CommonModule, FormsModule, RouterLink, FiltroGeneralPipe, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent,
    ButtonDirective, BadgeComponent, TableDirective, FormControlDirective, FormSelectDirective, SpinnerComponent],
  templateUrl: './usuarios-listado.component.html'
})
export class UsuariosListadoComponent implements OnInit {
  usuarios: UsuarioModel[] = [];
  filtroBusqueda = '';
  estado: FiltroUsuarios = 'ACTIVO';
  perfilId: number | null = null;
  cargando = true;
  readonly nombrePersona = nombrePersona;

  constructor(private adminService: AdminService, public auth: AuthService) { }

  ngOnInit(): void {
    this.adminService.getAll().subscribe({
      next: (d) => { this.usuarios = d; this.cargando = false; },
      error: (e) => { this.cargando = false; Swal.fire('Error', 'No se pudieron cargar los usuarios. ' + (e.error?.msg ?? e.message), 'error'); }
    });
  }

  get perfiles(): { id: number; nombre: string; cantidad: number }[] {
    const mapa = new Map<number, { id: number; nombre: string; cantidad: number }>();
    for (const u of this.usuarios) {
      const p = mapa.get(u.fk_perfil_id) ?? { id: u.fk_perfil_id, nombre: u.perfil_nombre ?? `Perfil ${u.fk_perfil_id}`, cantidad: 0 };
      p.cantidad++;
      mapa.set(u.fk_perfil_id, p);
    }
    return [...mapa.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  get filas(): UsuarioModel[] {
    return filtrarUsuarios(this.usuarios, this.estado, this.perfilId);
  }

  cuenta(f: FiltroUsuarios): number {
    return filtrarUsuarios(this.usuarios, f, this.perfilId).length;
  }
}
