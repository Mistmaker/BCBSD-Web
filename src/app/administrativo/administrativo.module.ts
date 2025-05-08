import { AdmDashboardComponent } from './adm-dashboard/adm-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativoRoutingModule } from './administrativo-routing.module';
import { VehiculosListadoComponent } from './mant-vehicular/vehiculos-listado/vehiculos-listado.component';


@NgModule({
  declarations: [
    AdmDashboardComponent,
    VehiculosListadoComponent
  ],
  imports: [
    CommonModule,
    AdministrativoRoutingModule
  ]
})
export class AdministrativoModule { }
