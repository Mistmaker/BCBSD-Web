import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdenesAbastecimientoModel } from '../models/ordenes-abastecimiento.model';
import { environment } from '../../../environments/environment';
import { VehiculosModel } from '../models/vehiculos.model';
import { PersonalModel } from '../../tthh/models/personal.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesAbastecimientoService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<OrdenesAbastecimientoModel[]>(`${environment.API_URL}/servicios/administrativo/ordenes-abastecimiento/getOrdenAbastecimiento.php`)
  }

  getById(id: number) {
    return this.http.get<OrdenesAbastecimientoModel>(`${environment.API_URL}/servicios/administrativo/ordenes-abastecimiento/getOrdenAbastecimiento.php?id=${id}`)
  }

  getVehiculos() {
    return this.http.get<VehiculosModel[]>(`${environment.API_URL}/servicios/administrativo/serv-generales/getVehiculos.php`)
  }

  getVehiculoUltKm(id: number) {
    return this.http.get<OrdenesAbastecimientoModel>(`${environment.API_URL}/servicios/administrativo/ordenes-abastecimiento/getOrdenUltimoKm.php?id=${id}`)
  }
  
  getConductores() {
    return this.http.get<PersonalModel[]>(`${environment.API_URL}/servicios/tthh/getConductores.php`)
  }

  save(orden: OrdenesAbastecimientoModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/administrativo/ordenes-abastecimiento/setOrdenAbastecimiento.php`, orden)
  }

  update(orden: OrdenesAbastecimientoModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/administrativo/ordenes-abastecimiento/setOrdenAbastecimiento.php`, orden)
  }

  imprimirOrden(ids: string[]){
    return `${environment.API_URL}/reportes/ordenAbastecimiento.php?idsParam=${encodeURIComponent(ids.join(','))}`;
  }
}
