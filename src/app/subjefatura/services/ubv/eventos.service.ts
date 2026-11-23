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

}
