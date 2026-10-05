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
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
