import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ModuloPrivilegios, PerfilDetalle, PerfilGuardar, PerfilModel, PersonaUsuario, UsuarioGuardar, UsuarioModel
} from '../models/usuarios.model';
import { HistorialParametro, RespuestaParametros } from '../models/parametros.model';

type Respuesta = { msg: string; id: number };

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly admin = `${environment.API_URL}/servicios/admin`;
  private readonly auth = `${environment.API_URL}/servicios/auth`;

  constructor(private http: HttpClient) { }

  // Parámetros del sistema
  getParametros() {
    return this.http.get<RespuestaParametros>(`${this.admin}/getParametros.php`);
  }
  getHistorialParametro(id: number) {
    return this.http.get<HistorialParametro[]>(`${this.admin}/getParametros.php`, { params: { historial: id } });
  }
  guardarParametro(param_id: number, param_value: string | string[]) {
    return this.http.put<{ msg: string; param_value: string }>(`${this.admin}/setParametro.php`, { param_id, param_value });
  }

  // Usuarios
  getAll() {
    return this.http.get<UsuarioModel[]>(`${this.admin}/getUsuarios.php`);
  }
  getById(id: number) {
    return this.http.get<UsuarioModel>(`${this.admin}/getUsuarios.php`, { params: { id } });
  }
  buscarPersona(doc: string) {
    return this.http.get<PersonaUsuario>(`${this.admin}/getPersonaUsuario.php`, { params: { doc } });
  }
  guardarUsuario(u: UsuarioGuardar) {
    return u.usuario_id
      ? this.http.put<Respuesta>(`${this.admin}/setUsuario.php`, u)
      : this.http.post<Respuesta>(`${this.admin}/setUsuario.php`, u);
  }
  /** El administrador restablece la clave de otro usuario */
  restablecerClave(usuarioId: number, clave: string) {
    return this.http.post<{ msg: string }>(`${this.admin}/setClaveUsuario.php`, { usuario_id: usuarioId, clave });
  }
  /** El usuario conectado cambia su propia clave */
  cambiarMiClave(claveActual: string, clave: string) {
    return this.http.post<{ msg: string }>(`${this.admin}/setClaveUsuario.php`, { clave_actual: claveActual, clave });
  }

  // Privilegios adicionales del usuario (además de los de su perfil)
  getPrivilegios(usuarioId: number) {
    return this.http.get<ModuloPrivilegios[]>(`${this.auth}/getPrivilegios.php`, { params: { id: usuarioId } });
  }
  guardarPrivilegios(usuarioId: number, roles: number[]) {
    return this.http.post<{ msg: string }>(`${this.auth}/setPrivilegios.php`, { usuario_id: usuarioId, roles });
  }

  // Perfiles
  getPerfiles() {
    return this.http.get<PerfilModel[]>(`${this.admin}/getPerfiles.php`);
  }
  getPerfil(id: number) {
    return this.http.get<PerfilDetalle>(`${this.admin}/getPerfiles.php`, { params: { id } });
  }
  /** Árbol de todos los privilegios sin marcar (perfil nuevo) */
  getArbolPrivilegios() {
    return this.http.get<ModuloPrivilegios[]>(`${this.admin}/getPerfiles.php`, { params: { arbol: 1 } });
  }
  guardarPerfil(p: PerfilGuardar) {
    return p.perfil_id
      ? this.http.put<Respuesta>(`${this.admin}/setPerfil.php`, p)
      : this.http.post<Respuesta>(`${this.admin}/setPerfil.php`, p);
  }
}
