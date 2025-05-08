import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./adm-dashboard/adm-dashboard.component').then(m => m.AdmDashboardComponent),
    data: {
      title: 'Administrativo'
    }
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./mant-vehicular/vehiculos-listado/vehiculos-listado.component').then(m => m.VehiculosListadoComponent),
    data: {
      title: 'Vehículos'
    }
  },
  {
    path: 'vehiculos/:id',
    loadComponent: () => import('./mant-vehicular/vehiculos-mantenimiento/vehiculos-mantenimiento.component').then(m => m.VehiculosMantenimientoComponent),
    data: {
      title: 'Vehículos'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
