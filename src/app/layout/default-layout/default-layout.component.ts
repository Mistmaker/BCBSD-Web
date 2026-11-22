import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { AuthService } from '../../auth/auth.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent {
  /** Se llena con el menú del usuario (getMenuUsuario.php); nunca con el menú completo de ejemplo. */
  public navItems: any[] = [];

  constructor(private _authService: AuthService, private destroyRef: DestroyRef) {
    this.cargarMenu();
    // Si cambian los privilegios del usuario conectado (se los asigna o quita el administrador, o una
    // pantalla le niega el acceso), se recargan el menú y los permisos sin volver a iniciar sesión.
    this._authService.privilegiosCambiados$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cargarMenu());
  }

  /** El menú se arma solo con las pantallas (roles con ruta) asignadas al usuario. */
  cargarMenu(): void {
    const user = this._authService.getUsuario();
    if (!user?.usuario) {
      this.navItems = [];
      return;
    }
    if (user.usuario.voluntario_id) {
      this.navItems = [...(user.usuario.menus ?? [])];
      return;
    }
    // Privilegios actuales: los asignados después del login se aplican sin volver a entrar
    this._authService.refrescarPermisos().subscribe({ error: (e) => console.error(e) });
    this._authService.getMenus(user.usuario.usuario_id, user.usuario.voluntario_id).subscribe({
      next: (data: any[]) => {
        // Incluye Administración > Usuarios / Perfiles para quien tenga esos privilegios (antes estaba fijo para el usuario 113)
        const menu = [...data];
        this.navItems = menu;
      },
      error: (e: any) => console.error(e)
    });
  }
}
