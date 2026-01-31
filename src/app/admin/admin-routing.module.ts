import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
      path: 'dashboard',
      loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      data: {
        title: 'Administrativo'
      }, canActivate: [AuthGuard]
    },
    {
      path: 'usuarios',
      loadComponent: () => import('./usuarios-listado/usuarios-listado.component').then(m => m.UsuariosListadoComponent),
      data: {
        title: 'Usuarios'
      }, canActivate: [AuthGuard]
    },
    {
      path: 'usuarios/:id',
      loadComponent: () => import('./usuarios-mantenimiento/usuarios-mantenimiento.component').then(m => m.UsuariosMantenimientoComponent),
      data: {
        title: 'Usuarios'
      }, canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
