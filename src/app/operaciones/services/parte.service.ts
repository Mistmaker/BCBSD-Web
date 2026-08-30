import { ParteModel } from './../models/partes.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParteService {

  constructor(private http: HttpClient) { }
  
    getAll() {
      return this.http.get<ParteModel[]>(`${environment.API_URL}/servicios/operaciones/getPartes.php`)
    }
  
    getById(id: number) {
      return this.http.get<ParteModel>(`${environment.API_URL}/servicios/operaciones/getPartes.php?id=${id}`)
    }
    
    // getPelotones(id: number) {
    //   return this.http.get<GruposModel[]>(`${environment.API_URL}/servicios/operaciones/getDistributivoPelotones.php?id=${id}`)
    // }
  
    // getEstaciones() {
    //   return this.http.get<EstacionesModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getEstaciones.php`)
    // }
  
    save(parte: ParteModel) {
      return this.http.post<any>(`${environment.API_URL}/servicios/operaciones/setParte.php`, parte)
    }
  
    update(parte: ParteModel) {
      return this.http.put<any>(`${environment.API_URL}/servicios/operaciones/setParte.php`, parte)
    }
}
