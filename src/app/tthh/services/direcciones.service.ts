import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DireccionesModel } from '../models/direcciones.model';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<DireccionesModel[]>(`${environment.API_URL}/servicios/tthh/getDirecciones.php`)
  }

  getById(id: number) {
    return this.http.get<DireccionesModel>(`${environment.API_URL}/servicios/tthh/getDirecciones.php?id=${id}`)
  }

  save(vehiculo: DireccionesModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/tthh/setDireccion.php`, vehiculo)
  }

  update(vehiculo: DireccionesModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/tthh/setDireccion.php`, vehiculo)
  }
}
