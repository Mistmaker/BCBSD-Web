import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { VoluntariosEventos } from '../../models/voluntarios.molde';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<VoluntariosEventos[]>(`${environment.API_URL}/servicios/subjefatura/ubv/getEventos.php`);
  }

  getById(id: number) {
    return this.http.get<VoluntariosEventos>(`${environment.API_URL}/servicios/subjefatura/ubv/getEventos.php?id=${id}`);
  }

  save(evento: VoluntariosEventos) {
    return this.http.post<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setEvento.php`, evento);
  }

  update(evento: VoluntariosEventos) {
    return this.http.put<any>(`${environment.API_URL}/servicios/subjefatura/ubv/setEvento.php`, evento);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.API_URL}/servicios/subjefatura/ubv/deleteEvento.php?id=${id}`);
  }

  getReporte(id: number, desde: string, hasta: string) {
    const url = `${environment.API_URL}/reportes/subjefatura/ubv/hojaEventos.php?id=${id}&desde=${desde}&hasta=${hasta}#zoom=page-width`;

    return this.http.get(url, {
      responseType: 'blob' // IMPORTANTE
    });
  }
}
