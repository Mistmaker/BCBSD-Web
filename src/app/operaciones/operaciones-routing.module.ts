import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

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
    data: {
      title: 'Parte de Auxilio'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'partes/:id',
    loadComponent: () => import('./parte-mantenimiento/parte-mantenimiento.component').then(m => m.ParteMantenimientoComponent),
    data: {
      title: 'Parte de Auxilio'
    }, canActivate: [AuthGuard]
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
