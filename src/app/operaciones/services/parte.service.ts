import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatalogosParte, ParteModel, ParteResumen } from '../models/partes.model';
import { EstadisticasPartes } from '../models/partes-estadisticas.model';

export interface FiltroPartes { desde?: string; hasta?: string; estacion?: number | null; tipo?: string; estado?: string; q?: string; }

@Injectable({
  providedIn: 'root'
})
export class ParteService {
  private readonly url = `${environment.API_URL}/servicios/operaciones`;

  constructor(private http: HttpClient) { }

  getAll(filtro: FiltroPartes = {}) {
    return this.http.get<ParteResumen[]>(`${this.url}/getPartes.php`, { params: parametros(filtro) });
  }

  getById(id: number) {
    return this.http.get<ParteModel>(`${this.url}/getPartes.php`, { params: { id } });
  }

  getCatalogos() {
    return this.http.get<CatalogosParte>(`${this.url}/getCatalogosParte.php`);
  }

  /** Informe estadístico imprimible (POST con los filtros y los gráficos en PNG) */
  urlInformeEstadistico(): string {
    return `${environment.API_URL}/reportes/operaciones/estadisticaPartes.php`;
  }

  getEstadisticas(filtro: FiltroPartes) {
    return this.http.get<EstadisticasPartes>(`${this.url}/getEstadisticasPartes.php`, { params: parametros(filtro) });
  }

  save(parte: ParteModel) {
    return this.http.post<{ msg: string; id: number; parte_numero: string }>(`${this.url}/setParte.php`, parte);
  }

  update(parte: ParteModel) {
    return this.http.put<{ msg: string; id: number; parte_numero: string }>(`${this.url}/setParte.php`, parte);
  }

  /** PDF del parte para imprimir y firmar (abrir con PdfService.abrir) */
  urlPdf(id: number): string {
    return `${environment.API_URL}/reportes/operaciones/parte.php?id=${id}`;
  }

  /** Imagen de la ubicación (mapa con el marcador) que va en el parte impreso */
  getMapa(id: number) {
    return this.http.get(`${this.url}/getParteMapa.php`, { params: { id }, responseType: 'blob' });
  }

  regenerarMapa(id: number) {
    return this.http.post<{ msg: string; mapa: boolean }>(`${this.url}/setParteMapa.php`, { parte_id: id });
  }

  anular(id: number, motivo: string) {
    return this.http.put<{ msg: string }>(`${this.url}/setParte.php`, { parte_id: id, parte_estado: 'ANULADO', parte_anulado_motivo: motivo });
  }
}

function parametros(filtro: FiltroPartes): HttpParams {
  let p = new HttpParams();
  Object.entries(filtro).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') p = p.set(k, String(v));
  });
  return p;
}
