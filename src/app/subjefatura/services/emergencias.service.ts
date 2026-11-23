import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstadisticasEmergencias } from '../models/emergencias.model';

/** Panel de la Subjefatura: estadística de emergencias a partir de los partes de servicio */
@Injectable({ providedIn: 'root' })
export class EmergenciasService {
  constructor(private http: HttpClient) { }

  getEstadisticas(filtro: { desde: string; hasta: string; estacion?: number | null }) {
    let params = new HttpParams().set('desde', filtro.desde).set('hasta', filtro.hasta);
    if (filtro.estacion) params = params.set('estacion', String(filtro.estacion));
    return this.http.get<EstadisticasEmergencias>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getEstadisticasEmergencias.php`, { params });
  }
}
