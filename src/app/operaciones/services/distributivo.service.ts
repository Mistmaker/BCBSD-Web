import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DistPeloModel, DistributivoModel, GruposModel } from '../models/distributivo.model';
import { EstacionesModel } from '../../subjefatura/models/estadisticas.model';

@Injectable({
  providedIn: 'root'
})
export class DistributivoService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<DistributivoModel[]>(`${environment.API_URL}/servicios/operaciones/getDistributivos.php`)
  }

  getById(id: number) {
    return this.http.get<DistributivoModel>(`${environment.API_URL}/servicios/operaciones/getDistributivos.php?id=${id}`)
  }
  
  getPelotones(id: number) {
    return this.http.get<GruposModel[]>(`${environment.API_URL}/servicios/operaciones/getDistributivoPelotones.php?id=${id}`)
  }

  getEstaciones() {
    return this.http.get<EstacionesModel[]>(`${environment.API_URL}/servicios/subjefatura/estadisticas/getEstaciones.php`)
  }

  save(distributivo: DistributivoModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/operaciones/setDistributivo.php`, distributivo)
  }

  update(distributivo: DistributivoModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/operaciones/setDistributivo.php`, distributivo)
  }

}
