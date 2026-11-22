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

  guardar(o: OperadorGuardar) {
    return o.conductor_id
      ? this.http.put<{ msg: string; id: number }>(`${this.url}/setOperador.php`, o)
      : this.http.post<{ msg: string; id: number }>(`${this.url}/setOperador.php`, o);
  }
}
