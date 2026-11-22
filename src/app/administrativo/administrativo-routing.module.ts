import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./adm-dashboard/adm-dashboard.component').then(m => m.AdmDashboardComponent),
    data: {
      title: 'Administrativo'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./mant-vehicular/vehiculos-listado/vehiculos-listado.component').then(m => m.VehiculosListadoComponent),
    data: {
      title: 'Vehículos'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/:id',
    loadComponent: () => import('./mant-vehicular/vehiculos-mantenimiento/vehiculos-mantenimiento.component').then(m => m.VehiculosMantenimientoComponent),
    data: {
      title: 'Vehículos'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ordenes-movilizacion',
    loadComponent: () => import('./serv-generales/orden-movilizacion-lista/orden-movilizacion-lista.component').then(m => m.OrdenMovilizacionListaComponent),
    data: {
      title: 'Ordenes de Movilización'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ordenes-movilizacion/:id',
    loadComponent: () => import('./serv-generales/orden-movilizacion-mantenimiento/orden-movilizacion-mantenimiento.component').then(m => m.OrdenMovilizacionMantenimientoComponent),
    data: {
      title: 'Generación de ordenes'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ordenes-abastecimiento',
    loadComponent: () => import('./ordenes-abastecimiento/ordenes-abastecimiento-lista/ordenes-abastecimiento-lista.component').then(m => m.OrdenesAbastecimientoListaComponent),
    data: {
      title: 'Ordenes de Abastecimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ordenes-abastecimiento/:id',
    loadComponent: () => import('./ordenes-abastecimiento/ordenes-abastecimiento-mantenimiento/ordenes-abastecimiento-mantenimiento.component').then(m => m.OrdenesAbastecimientoMantenimientoComponent),
    data: {
      title: 'Generación de Abastecimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ordenes-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/ordenes-lista/ordenes-mantenimiento-lista.component').then(m => m.OrdenesMantenimientoListaComponent),
    data: {
      title: 'Órdenes de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'ordenes-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/orden-form/orden-mantenimiento-form.component').then(m => m.OrdenMantenimientoFormComponent),
    data: {
      title: 'Orden de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'informes-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/informes-lista/informes-mantenimiento-lista.component').then(m => m.InformesMantenimientoListaComponent),
    data: {
      title: 'Informes de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'informes-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/informe-form/informe-mantenimiento-form.component').then(m => m.InformeMantenimientoFormComponent),
    data: {
      title: 'Informe de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'planes-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/planes-lista/planes-mantenimiento-lista.component').then(m => m.PlanesMantenimientoListaComponent),
    data: {
      title: 'Planes de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'planes-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/plan-form/plan-mantenimiento-form.component').then(m => m.PlanMantenimientoFormComponent),
    data: {
      title: 'Plan de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'contratos-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/contratos-lista/contratos-mantenimiento-lista.component').then(m => m.ContratosMantenimientoListaComponent),
    data: {
      title: 'Contratos de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  {
    path: 'contratos-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/contrato-form/contrato-mantenimiento-form.component').then(m => m.ContratoMantenimientoFormComponent),
    data: {
      title: 'Contrato de Mantenimiento'
    }, canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
