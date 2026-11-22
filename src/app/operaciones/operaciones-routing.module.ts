import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { permisoGuard } from '../auth/permiso.guard';

const routes: Routes = [
  {
    path: 'distributivo',
    loadComponent: () => import('./distributivo-listado/distributivo-listado.component').then(m => m.DistributivoListadoComponent),
    data: {
      title: 'Distributivo'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'distributivo/:id',
    loadComponent: () => import('./distributivo-mantenimiento/distributivo-mantenimiento.component').then(m => m.DistributivoMantenimientoComponent),
    data: {
      title: 'Distributivo'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'partes',
    loadComponent: () => import('./parte-listado/parte-listado.component').then(m => m.ParteListadoComponent),
    data: { permiso: 'OPE_PARTES', title: 'Partes de servicio' }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'partes-estadisticas',
    loadComponent: () => import('./partes-estadisticas/partes-estadisticas.component').then(m => m.PartesEstadisticasComponent),
    data: { permiso: 'OPE_PARTES_ESTADISTICAS', title: 'Estadística de partes' }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'partes/:id',
    loadComponent: () => import('./parte-mantenimiento/parte-mantenimiento.component').then(m => m.ParteMantenimientoComponent),
    data: { permiso: 'OPE_PARTES', title: 'Parte de servicio' }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'estaciones',
    loadComponent: () => import('./estaciones-listado/estaciones-listado.component').then(m => m.EstacionesListadoComponent),
    data: {
      title: 'Estaciones'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'estaciones/:id',
    loadComponent: () => import('./estaciones-mantenimiento/estaciones-mantenimiento.component').then(m => m.EstacionesMantenimientoComponent),
    data: {
      title: 'Estación'
    }, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule { }
