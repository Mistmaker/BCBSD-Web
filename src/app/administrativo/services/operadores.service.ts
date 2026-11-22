import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatalogosOperador, OperadorGuardar, OperadorModel, PersonaOperador } from '../models/operadores.model';

@Injectable({ providedIn: 'root' })
export class OperadoresService {
  private readonly url = `${environment.API_URL}/servicios/administrativo/operadores`;

  constructor(private http: HttpClient) { }

  getOperadores() {
    return this.http.get<OperadorModel[]>(`${this.url}/getOperadores.php`);
  }

  getOperador(id: number) {
    return this.http.get<OperadorModel>(`${this.url}/getOperadores.php`, { params: { id } });
  }

  getCatalogos() {
    return this.http.get<CatalogosOperador>(`${this.url}/getCatalogosOperador.php`);
  }

  buscarPorCedula(cedula: string) {
    return this.http.get<PersonaOperador>(`${this.url}/getPersonaOperador.php`, { params: { cedula } });
  }

  /**
   * Registra (sin conductor_id) o actualiza la licencia (con conductor_id). Siempre POST multipart: 'datos' en JSON y,
   * si hay, el PDF escaneado en 'licencia_pdf' (PHP no recibe archivos en PUT).
   */
  guardar(o: OperadorGuardar, pdf: File | null = null) {
    const form = new FormData();
    form.append('datos', JSON.stringify(o));
    if (pdf) { form.append('licencia_pdf', pdf, pdf.name); }
    return this.http.post<{ msg: string; id: number; conductor_pdf: string | null }>(`${this.url}/setOperador.php`, form);
  }

  /** URL del PDF de la licencia (se abre con PdfService, que envía el token) */
  urlLicencia(id: number): string {
    return `${this.url}/getLicenciaPdf.php?id=${id}`;
  }
}
