import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResumenGerencial } from '../models/resumen-gerencial.model';

@Injectable({ providedIn: 'root' })
export class ResumenGerencialService {
  constructor(private http: HttpClient) { }

  getResumen(mes: string) {
    return this.http.get<ResumenGerencial>(`${environment.API_URL}/servicios/administrativo/getResumenGerencial.php`, { params: { mes } });
  }
}
