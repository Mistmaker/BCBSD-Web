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

}
