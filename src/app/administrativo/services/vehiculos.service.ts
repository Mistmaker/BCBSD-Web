import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { VehiculosModel } from '../models/vehiculos.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<VehiculosModel[]>(`${environment.API_URL}/servicios/administrativo/mant-vehicular/getVehiculos.php`)
  }
  
  getById(id: number) {
    return this.http.get<VehiculosModel>(`${environment.API_URL}/servicios/administrativo/mant-vehicular/getVehiculos.php?id=${id}`)
  }

  save(vehiculo: VehiculosModel){
    return this.http.post<any>(`${environment.API_URL}/servicios/administrativo/mant-vehicular/setVehiculo.php`, vehiculo)
  }
  
  update(vehiculo: VehiculosModel){
    return this.http.put<any>(`${environment.API_URL}/servicios/administrativo/mant-vehicular/setVehiculo.php`, vehiculo)
  }

}
