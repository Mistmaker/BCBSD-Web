import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/arch-dashboard/arch-dashboard.component').then(m => m.ArchDashboardComponent),
    data: {
      title: 'Dashboard'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'documentos',
    loadComponent: () => import('./components/documentos-listado/documentos-listado.component').then(m => m.DocumentosListadoComponent),
    data: {
      title: 'Docuemtos'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'documentos/:id',
    loadComponent: () => import('./components/documentos-mantenimiento/documentos-mantenimiento.component').then(m => m.DocumentosMantenimientoComponent),
    data: {
      title: 'Docuemtos Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'actas',
    loadComponent: () => import('./components/actas-listado/actas-listado.component').then(m => m.ActasListadoComponent),
    data: {
      title: 'Actas'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'actas/:id',
    loadComponent: () => import('./components/actas-mantenimiento/actas-mantenimiento.component').then(m => m.ActasMantenimientoComponent),
    data: {
      title: 'Actas Mantenimiento'
    }, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivoRoutingModule { }
