import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfigPeticion, PeticionGuardar, PeticionMaterialesModel } from '../models/peticion-materiales.model';

type Respuesta = { msg: string; id: number; peticion_codigo: string };

@Injectable({ providedIn: 'root' })
export class PeticionMaterialesService {
  private readonly url = `${environment.API_URL}/servicios/administrativo/serv-generales`;

  constructor(private http: HttpClient) { }

  getAll(anio?: number | null) {
    return this.http.get<PeticionMaterialesModel[]>(`${this.url}/getPeticionesMateriales.php`, { params: anio ? { anio } : {} });
  }
  getById(id: number) {
    return this.http.get<PeticionMaterialesModel>(`${this.url}/getPeticionesMateriales.php`, { params: { id } });
  }
  getConfig() {
    return this.http.get<ConfigPeticion>(`${this.url}/getPeticionesMateriales.php`, { params: { config: 1 } });
  }
  guardar(p: PeticionGuardar) {
    return p.peticion_id
      ? this.http.put<Respuesta>(`${this.url}/setPeticionMateriales.php`, p)
      : this.http.post<Respuesta>(`${this.url}/setPeticionMateriales.php`, p);
  }
  anular(id: number, motivo: string) {
    return this.http.put<Respuesta>(`${this.url}/setPeticionMateriales.php`, { peticion_id: id, peticion_estado: 'ANULADA', peticion_observaciones: motivo });
  }
  /** URL del PDF (se abre con PdfService, que envía el token) */
  urlPdf(id: number): string {
    return `${environment.API_URL}/reportes/servicios-generales/peticionMateriales.php?id=${id}`;
  }
}
