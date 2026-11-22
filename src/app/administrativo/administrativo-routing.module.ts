import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { permisoGuard } from '../auth/permiso.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./adm-dashboard/adm-dashboard.component').then(m => m.AdmDashboardComponent),
    data: {
      permiso: 'ADM_DASHBOARD',
      title: 'Resumen gerencial'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'vehiculos',
    loadComponent: () => import('./mant-vehicular/vehiculos-listado/vehiculos-listado.component').then(m => m.VehiculosListadoComponent),
    data: {
      permiso: 'ADM_VEHICULOS',
      title: 'Vehículos'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'vehiculos/:id',
    loadComponent: () => import('./mant-vehicular/vehiculos-mantenimiento/vehiculos-mantenimiento.component').then(m => m.VehiculosMantenimientoComponent),
    data: {
      permiso: 'ADM_VEHICULOS',
      title: 'Vehículos'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'bitacora-vehiculos',
    loadComponent: () => import('./bitacora-vehiculos/flota/bitacora-flota.component').then(m => m.BitacoraFlotaComponent),
    data: {
      permiso: 'ADM_BITACORA_VEHICULOS',
      title: 'Bitácora de vehículos'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'bitacora-vehiculos/:id',
    loadComponent: () => import('./bitacora-vehiculos/vehiculo/bitacora-vehiculo.component').then(m => m.BitacoraVehiculoComponent),
    data: {
      permiso: 'ADM_BITACORA_VEHICULOS',
      title: 'Bitácora del vehículo'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'operadores',
    loadComponent: () => import('./operadores/lista/operadores-lista.component').then(m => m.OperadoresListaComponent),
    data: {
      permiso: 'ADM_OPERADORES',
      title: 'Operadores'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'operadores/:id',
    loadComponent: () => import('./operadores/form/operador-form.component').then(m => m.OperadorFormComponent),
    data: {
      permiso: 'ADM_OPERADORES',
      title: 'Operador'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'peticiones-materiales',
    loadComponent: () => import('./serv-generales/peticiones-materiales-lista/peticiones-materiales-lista.component').then(m => m.PeticionesMaterialesListaComponent),
    data: {
      permiso: 'ADM_PETICIONES_MATERIALES',
      title: 'Peticiones de materiales'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'peticiones-materiales/:id',
    loadComponent: () => import('./serv-generales/peticion-materiales-form/peticion-materiales-form.component').then(m => m.PeticionMaterialesFormComponent),
    data: {
      permiso: 'ADM_PETICIONES_MATERIALES',
      title: 'Petición de materiales'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'ordenes-movilizacion',
    loadComponent: () => import('./serv-generales/orden-movilizacion-lista/orden-movilizacion-lista.component').then(m => m.OrdenMovilizacionListaComponent),
    data: {
      permiso: 'ADM_MOVILIZACION',
      title: 'Ordenes de Movilización'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'ordenes-movilizacion/:id',
    loadComponent: () => import('./serv-generales/orden-movilizacion-mantenimiento/orden-movilizacion-mantenimiento.component').then(m => m.OrdenMovilizacionMantenimientoComponent),
    data: {
      permiso: 'ADM_MOVILIZACION',
      title: 'Generación de ordenes'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'ordenes-abastecimiento',
    loadComponent: () => import('./ordenes-abastecimiento/ordenes-abastecimiento-lista/ordenes-abastecimiento-lista.component').then(m => m.OrdenesAbastecimientoListaComponent),
    data: {
      permiso: 'ADM_COMBUSTIBLE',
      title: 'Ordenes de Abastecimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'ordenes-abastecimiento/:id',
    loadComponent: () => import('./ordenes-abastecimiento/ordenes-abastecimiento-mantenimiento/ordenes-abastecimiento-mantenimiento.component').then(m => m.OrdenesAbastecimientoMantenimientoComponent),
    data: {
      permiso: 'ADM_COMBUSTIBLE',
      title: 'Generación de Abastecimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'ordenes-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/ordenes-lista/ordenes-mantenimiento-lista.component').then(m => m.OrdenesMantenimientoListaComponent),
    data: {
      permiso: 'MANT_ORDENES',
      title: 'Órdenes de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'ordenes-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/orden-form/orden-mantenimiento-form.component').then(m => m.OrdenMantenimientoFormComponent),
    data: {
      permiso: 'MANT_ORDENES',
      title: 'Orden de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'informes-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/informes-lista/informes-mantenimiento-lista.component').then(m => m.InformesMantenimientoListaComponent),
    data: {
      permiso: 'MANT_BITACORAS',
      title: 'Informes de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'informes-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/informe-form/informe-mantenimiento-form.component').then(m => m.InformeMantenimientoFormComponent),
    data: {
      permiso: 'MANT_BITACORAS',
      title: 'Informe de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'planes-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/planes-lista/planes-mantenimiento-lista.component').then(m => m.PlanesMantenimientoListaComponent),
    data: {
      permiso: 'MANT_PLANES',
      title: 'Planes de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'planes-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/plan-form/plan-mantenimiento-form.component').then(m => m.PlanMantenimientoFormComponent),
    data: {
      permiso: 'MANT_PLANES',
      title: 'Plan de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'contratos-mantenimiento',
    loadComponent: () => import('./mantenimiento-vehicular/contratos-lista/contratos-mantenimiento-lista.component').then(m => m.ContratosMantenimientoListaComponent),
    data: {
      permiso: 'MANT_CONTRATOS',
      title: 'Contratos de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  {
    path: 'contratos-mantenimiento/:id',
    loadComponent: () => import('./mantenimiento-vehicular/contrato-form/contrato-mantenimiento-form.component').then(m => m.ContratoMantenimientoFormComponent),
    data: {
      permiso: 'MANT_CONTRATOS',
      title: 'Contrato de Mantenimiento'
    }, canActivate: [AuthGuard, permisoGuard]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
