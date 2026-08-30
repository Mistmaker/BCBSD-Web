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
  {
    path: 'ubv-voluntarios',
    loadComponent: () => import('./ubv/voluntarios-listado/voluntarios-listado.component').then(m => m.VoluntariosListadoComponent),
    data: {
      title: 'Listado de Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-voluntarios/:id',
    loadComponent: () => import('./ubv/voluntarios-mantenimiento/voluntarios-mantenimiento.component').then(m => m.VoluntariosMantenimientoComponent),
    data: {
      title: 'Mantenimiento de Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-actividades',
    loadComponent: () => import('./ubv/actividades-listado/actividades-listado.component').then(m => m.ActividadesListadoComponent),
    data: {
      title: 'Listado de Actividades - Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-actividades/:id',
    loadComponent: () => import('./ubv/actividades-mantenimiento/actividades-mantenimiento.component').then(m => m.ActividadesMantenimientoComponent),
    data: {
      title: 'Actividades de Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-asignacion',
    loadComponent: () => import('./ubv/asignacion-listado/asignacion-listado.component').then(m => m.AsignacionListadoComponent),
    data: {
      title: 'Asignacion de Guardias - Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-asignacion/:id',
    loadComponent: () => import('./ubv/asignacion-mantenimiento/asignacion-mantenimiento.component').then(m => m.AsignacionMantenimientoComponent),
    data: {
      title: 'Asignacion de Guardia de Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-eventos',
    loadComponent: () => import('./ubv/eventos-listado/eventos-listado.component').then(m => m.EventosListadoComponent),
    data: {
      title: 'Eventos - Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ubv-eventos/:id',
    loadComponent: () => import('./ubv/eventos-mantenimiento/eventos-mantenimiento.component').then(m => m.EventosMantenimientoComponent),
    data: {
      title: 'Eventos de Bomberos Voluntarios del BCBSD'
    }, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjefaturaRoutingModule { }
