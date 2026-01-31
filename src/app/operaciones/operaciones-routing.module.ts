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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule { }
