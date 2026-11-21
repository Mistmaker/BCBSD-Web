import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { usuario: string; password: string }) {
    return this.http.post<any>(`${environment.API_URL}/servicios/auth/login.php`, credentials);
  }
  
  loginVoluntarios(credentials: { usuario: string; password: string }) {
    return this.http.post<any>(`${environment.API_URL}/servicios/auth/loginVoluntarios.php`, credentials);
  }

  setSession(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): any {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  getUsuarioId(): number | null {
    return this.getUsuario()?.usuario?.usuario_id ?? null;
  }

  getRoles(usuario_id: number) {
    return this.http.get<number[]>(`${environment.API_URL}/servicios/auth/getRoles.php?id=${usuario_id}`);
  }

  getMenus(usuario_id: number, voluntario_id: number = 0): any {
    return this.http.get<any[]>(`${environment.API_URL}/servicios/auth/getMenuUsuario.php?id=${usuario_id}&id_vol=${voluntario_id}`);
  }

  ExisteRol(rol_id: number): boolean {
    const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
    const roles = userData.usuario.roles
    return roles.includes(rol_id);
  }

  ExisteRoles(roles: number[]): boolean {
    const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
    const rolesuser = userData.usuario.roles
    return roles.some(r => rolesuser.includes(r));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('usuario');
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

}
