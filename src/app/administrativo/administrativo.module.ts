import { AdmDashboardComponent } from './adm-dashboard/adm-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativoRoutingModule } from './administrativo-routing.module';
import { VehiculosListadoComponent } from './mant-vehicular/vehiculos-listado/vehiculos-listado.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { OrdenMovilizacionListaComponent } from './serv-generales/orden-movilizacion-lista/orden-movilizacion-lista.component';

@NgModule({
  declarations: [
    AdmDashboardComponent,
    VehiculosListadoComponent,
    OrdenMovilizacionListaComponent
  ],
  imports: [
    CommonModule,
    AdministrativoRoutingModule,
    NgSelectModule,
    FormsModule
  ]
})
export class AdministrativoModule { }
