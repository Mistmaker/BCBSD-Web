import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResumenGerencial } from '../models/resumen-gerencial.model';

@Injectable({ providedIn: 'root' })
export class ResumenGerencialService {
  constructor(private http: HttpClient) { }

  /** Informe imprimible (POST con el mes y el gráfico en PNG) */
  urlInforme(): string {
    return `${environment.API_URL}/reportes/administrativo/resumenGerencial.php`;
  }

  getResumen(mes: string) {
    return this.http.get<ResumenGerencial>(`${environment.API_URL}/servicios/administrativo/getResumenGerencial.php`, { params: { mes } });
  }
}
