import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./sbj-dashboard/sbj-dashboard.component').then(m => m.SbjDashboardComponent),
    data: {
      title: 'Subjefatura'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'intervenciones',
    loadComponent: () => import('./intervenciones-listado/intervenciones-listado.component').then(m => m.IntervencionesListadoComponent),
    data: {
      title: 'Intervenciones'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'intervenciones/:id',
    loadComponent: () => import('./intervenciones-mantenimiento/intervenciones-mantenimiento.component').then(m => m.IntervencionesMantenimientoComponent),
    data: {
      title: 'Intervenciones'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'aph-hojas',
    loadComponent: () => import('./aph-hoja-ruta-listado/aph-hoja-ruta-listado.component').then(m => m.AphHojaRutaListadoComponent),
    data: {
      title: 'Hojas de Ruta APH'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'aph-hojas/:id',
    loadComponent: () => import('./aph-hoja-ruta-mantenimiento/aph-hoja-ruta-mantenimiento.component').then(m => m.AphHojaRutaMantenimientoComponent),
    data: {
      title: 'Hojas de Ruta APH - Registro'
    }, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjefaturaRoutingModule { }
