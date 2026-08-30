import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { VoluntariosActividades } from '../../models/voluntarios.molde';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<VoluntariosActividades[]>(`${environment.API_URL}/servicios/subjefatura/ubv/getActividades.php`);
  }

  getById(id: number) {
    return this.http.get<VoluntariosActividades>(`${environment.API_URL}/servicios/subjefatura/ubv/getActividades.php?id=${id}`);
  }

  save(actividad: VoluntariosActividades) {
    return this.http.post<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setActividad.php`, actividad);
  }

  update(actividad: VoluntariosActividades) {
    return this.http.put<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setActividad.php`, actividad);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.API_URL}/servicios/subjefatura/ubv/deleteActividad.php?id=${id}`);
  }

  getReporte(id: number, desde: string, hasta: string) {
    const url = `${environment.API_URL}/reportes/subjefatura/ubv/hojaActividades.php?id=${id}&desde=${desde}&hasta=${hasta}#zoom=page-width`;
  
    return this.http.get(url, {
      responseType: 'blob' // IMPORTANTE
    });
  }
}
