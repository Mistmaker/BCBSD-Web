import { Component } from '@angular/core';
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
import { navItems } from './_nav';
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
  public navItems = [...navItems];

  constructor(private _authService: AuthService){

    const user = this._authService.getUsuario();

    console.log(user.usuario.menus);

    // this.navItems = []
    this.navItems = [...user.usuario.menus]


    this.navItems.push(
      {
        name: 'Administrador',
        url: '/adm',
        iconComponent: { name: 'cil-notes' },
        children: [
          {
            name: 'Dashboard',
            url: '/adm/dashboard',
            icon: 'nav-icon-bullet'
          },
          {
            name: 'Usuarios',
            url: '/adm/usuarios',
            icon: 'nav-icon-bullet'
          },
          {
            name: 'Perfiles',
            url: '/adm/perfiles',
            icon: 'nav-icon-bullet'
          },
          
        ]
      }
    );
  }
}
