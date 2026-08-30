import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Voluntarios } from '../../models/voluntarios.molde';

@Injectable({
  providedIn: 'root'
})
export class VoluntariosService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Voluntarios[]>(`${environment.API_URL}/servicios/subjefatura/ubv/getVoluntarios.php`);
  }

  getById(id: number) {
    return this.http.get<Voluntarios>(`${environment.API_URL}/servicios/subjefatura/ubv/getVoluntarios.php?id=${id}`);
  }

  save(voluntario: Voluntarios) {
    return this.http.post<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setVoluntario.php`, voluntario);
  }

  update(voluntario: Voluntarios) {
    return this.http.put<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setVoluntario.php`, voluntario);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.API_URL}/servicios/subjefatura/ubv/deleteVoluntario.php?id=${id}`);
  }
}
