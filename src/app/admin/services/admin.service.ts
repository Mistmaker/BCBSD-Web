import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuariosModel } from '../models/usuarios.model';
import { PersonalModel } from '../../tthh/models/personal.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<UsuariosModel[]>(`${environment.API_URL}/servicios/auth/getUsuarios.php`)
  }

  getById(id: number) {
    return this.http.get<UsuariosModel>(`${environment.API_URL}/servicios/auth/getUsuarios.php?id=${id}`)
  }

  save(usuario: UsuariosModel) {
    return this.http.post<any>(`${environment.API_URL}/servicios/auth/getUsuarios.php`, usuario)
  }

  update(usuario: UsuariosModel) {
    return this.http.put<any>(`${environment.API_URL}/servicios/auth/getUsuarios.php`, usuario)
  }

  getPersonal() {
    return this.http.get<PersonalModel[]>(`${environment.API_URL}/servicios/auth/getUsuarios.php`)
  }

  getPrivilegios(usuarioId: number) {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/auth/getPrivilegios.php?id=${usuarioId}`);
  }
  
  guardarPrivilegios(usuarioId: number, roles: number[]) {
    return this.http.post(`${environment.API_URL}/servicios/auth/setPrivilegios.php`, {
      usuario_id: usuarioId,
      roles
    });
  }
}
