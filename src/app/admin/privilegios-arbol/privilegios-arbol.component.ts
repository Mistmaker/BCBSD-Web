import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ButtonDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective } from '@coreui/angular';

import { contarEfectivos, filtrarArbol, marcarTodos, ModuloPrivilegios, RolPrivilegio, SubmoduloPrivilegios, todosLosRoles } from '../models/usuarios.model';

/**
 * Árbol módulo > submódulo > privilegios con casillas. Edita en el mismo arreglo (rol.asignado).
 * Los privilegios del perfil (del_perfil) se muestran marcados y bloqueados.
 */
@Component({
  selector: 'app-privilegios-arbol',
  imports: [CommonModule, FormsModule, BadgeComponent, ButtonDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, FormControlDirective],
  templateUrl: './privilegios-arbol.component.html',
  styles: [`
    .submodulo { border-left: 3px solid var(--cui-border-color); }
    .rol { min-height: 2.4rem; }
    .codigo { font-size: .72rem; }
  `]
})
export class PrivilegiosArbolComponent {
  readonly arbol = input.required<ModuloPrivilegios[]>();
  readonly soloLectura = input(false);
  /** Texto de la marca de los privilegios que vienen del perfil */
  readonly etiquetaPerfil = input('del perfil');
  readonly filtro = signal('');
  readonly soloMarcados = signal(false);
  /** Se incrementa al marcar para recalcular los conteos */
  private readonly version = signal(0);

  readonly visibles = computed(() => {
    this.version();
    const filtrado = filtrarArbol(this.arbol(), this.filtro());
    if (!this.soloMarcados()) { return filtrado; }
    return filtrado.map(m => ({ ...m, submodulos: m.submodulos.map(s => ({ ...s, roles: s.roles.filter(r => r.asignado || r.del_perfil) })).filter(s => s.roles.length) }))
      .filter(m => m.submodulos.length);
  });
  readonly totales = computed(() => { this.version(); return contarEfectivos(todosLosRoles(this.arbol())); });

  marcar(rol: RolPrivilegio, valor: boolean): void {
    rol.asignado = valor;
    this.version.update(v => v + 1);
  }

  todos(sub: SubmoduloPrivilegios, valor: boolean): void {
    marcarTodos(sub.roles, valor);
    this.version.update(v => v + 1);
  }

  efectivos(roles: RolPrivilegio[]): number {
    return roles.filter(r => r.asignado || r.del_perfil).length;
  }

  editables(roles: RolPrivilegio[]): boolean {
    return roles.some(r => !r.del_perfil);
  }

  rastrear = (_: number, r: RolPrivilegio) => r.rol_id;
}
