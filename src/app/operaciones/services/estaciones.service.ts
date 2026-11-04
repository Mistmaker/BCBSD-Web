import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstacionesModel } from '../models/estaciones.model';
import { JornadasModel } from '../../tthh/models/jornadas.model';

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  constructor(private http: HttpClient) { }
  
    getAll() {
      return this.http.get<EstacionesModel[]>(`${environment.API_URL}/servicios/operaciones/getEstaciones.php`)
    }
  
    getById(id: number) {
      return this.http.get<EstacionesModel>(`${environment.API_URL}/servicios/operaciones/getEstaciones.php?id=${id}`)
    }

    getJornadas() {
      return this.http.get<JornadasModel[]>(`${environment.API_URL}/servicios/tthh/getJornadas.php`)
    }
    
    // getPelotones(id: number) {
    //   return this.http.get<GruposModel[]>(`${environment.API_URL}/servicios/operaciones/getDistributivoPelotones.php?id=${id}`)
    // }
  
    // getEstaciones() {
    //   return this.http.get<EstacionesModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getEstaciones.php`)
    // }
  
    save(estacion: EstacionesModel) {
      return this.http.post<any>(`${environment.API_URL}/servicios/operaciones/setEstacion.php`, estacion)
    }
  
    update(estacion: EstacionesModel) {
      return this.http.put<any>(`${environment.API_URL}/servicios/operaciones/setEstacion.php`, estacion)
    }
}
