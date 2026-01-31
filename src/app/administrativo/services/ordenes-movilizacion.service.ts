import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OrdenesMovilizacionModel } from '../models/ordenes-movilizacion.model';
import { VehiculosModel } from '../models/vehiculos.model';
import { PersonalModel } from '../../tthh/models/personal.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesMovilizacionService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<OrdenesMovilizacionModel[]>(`${environment.API_URL}/servicios/administrativo/serv-generales/getOrdenes.php`)
  }

  getById(id: number) {
    return this.http.get<OrdenesMovilizacionModel>(`${environment.API_URL}/servicios/administrativo/serv-generales/getOrdenes.php?id=${id}`)
  }

  getVehiculos() {
    return this.http.get<VehiculosModel[]>(`${environment.API_URL}/servicios/administrativo/serv-generales/getVehiculos.php`)
  }

  getVehiculoUltKm(id: number) {
    return this.http.get<OrdenesMovilizacionModel>(`${environment.API_URL}/servicios/administrativo/serv-generales/getOrdenUltimoKm.php?id=${id}`)
  }
  
  getConductores() {
    return this.http.get<PersonalModel[]>(`${environment.API_URL}/servicios/tthh/getConductores.php`)
  }

  save(orden: OrdenesMovilizacionModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/administrativo/serv-generales/setOrden.php`, orden)
  }

  update(orden: OrdenesMovilizacionModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/administrativo/serv-generales/setOrden.php`, orden)
  }

  imprimirOrden(id: number){
    return `${environment.API_URL}/reportes/ordenMovilizacion.php?id=${id}`;
  }
}
