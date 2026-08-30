import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Direccion, Documento, TipoDocumento } from '../models/archivo.model';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Documento[]>(`${environment.API_URL}/servicios/archivo/getDocumentos.php`);
  }

  getById(id: number) {
    return this.http.get<Documento>(`${environment.API_URL}/servicios/archivo/getDocumentos.php?id=${id}`);
  }

  save(documento: Documento) {
    return this.http.post<any>(`${environment.API_URL}/servicios/archivo/setDocumento.php`, documento);
  }

  update(documento: Documento) {
    return this.http.put<any>(`${environment.API_URL}/servicios/archivo/setDocumento.php`, documento);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.API_URL}/servicios/archivo/deleteDocumento.php?id=${id}`);
  }

  getDirecciones() {
    return this.http.get<Direccion[]>(`${environment.API_URL}/servicios/archivo/getDirecciones.php`);
  }

  getTiposDocumento() {
    return this.http.get<TipoDocumento[]>(`${environment.API_URL}/servicios/archivo/getTiposDocumento.php`);
  }
}