import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RespuestaFlota, RespuestaVehiculo } from '../models/bitacora.model';

@Injectable({ providedIn: 'root' })
export class BitacoraService {
  private readonly url = `${environment.API_URL}/servicios/administrativo/bitacora`;

  constructor(private http: HttpClient) { }

  getFlota(desde: string, hasta: string) {
    return this.http.get<RespuestaFlota>(`${this.url}/getBitacoraFlota.php`, { params: { desde, hasta } });
  }

  getVehiculo(id: number, desde: string, hasta: string) {
    return this.http.get<RespuestaVehiculo>(`${this.url}/getBitacoraVehiculo.php`, { params: { id, desde, hasta } });
  }
}
