import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { permisoGuard } from '../auth/permiso.guard';

// Administración del sistema (/adm). Privilegios en BCBSD-Api: migrations/admin/01-usuarios-perfiles.sql
const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    data: { title: 'Administrativo' }, canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios-listado/usuarios-listado.component').then(m => m.UsuariosListadoComponent),
    data: { permiso: 'SIS_USUARIOS', title: 'Usuarios' }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'usuarios/:id',
    loadComponent: () => import('./usuarios-mantenimiento/usuarios-mantenimiento.component').then(m => m.UsuariosMantenimientoComponent),
    data: { permiso: 'SIS_USUARIOS', title: 'Usuario' }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'perfiles',
    loadComponent: () => import('./perfiles-listado/perfiles-listado.component').then(m => m.PerfilesListadoComponent),
    data: { permiso: 'SIS_PERFILES', title: 'Perfiles' }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'perfiles/:id',
    loadComponent: () => import('./perfiles-mantenimiento/perfiles-mantenimiento.component').then(m => m.PerfilesMantenimientoComponent),
    data: { permiso: 'SIS_PERFILES', title: 'Perfil' }, canActivate: [AuthGuard, permisoGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
