import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AsignacionUbvModel } from '../../models/voluntarios.molde';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<AsignacionUbvModel[]>(`${environment.API_URL}/servicios/subjefatura/ubv/getAsignaciones.php`);
  }

  getById(id: number) {
    return this.http.get<AsignacionUbvModel>(`${environment.API_URL}/servicios/subjefatura/ubv/getAsignaciones.php?id=${id}`);
  }

  save(asignacion: AsignacionUbvModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setAsignacion.php`, asignacion);
  }

  update(asignacion: AsignacionUbvModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setAsignacion.php`, asignacion);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.API_URL}/servicios/subjefatura/ubv/deleteAsignacion.php?id=${id}`);
  }
}
