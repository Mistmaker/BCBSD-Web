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

  /** JWT emitido por el API al iniciar sesión. */
  getToken(): string | null {
    const token = this.getUsuario()?.token;
    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  /** Fecha de expiración (ms) leída del claim `exp` del token, o null si no se puede leer. */
  getTokenExpiration(token: string | null = this.getToken()): number | null {
    if (!token) { return null; }
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const exp = JSON.parse(json).exp;
      return typeof exp === 'number' ? exp * 1000 : null;
    } catch {
      return null;
    }
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

  /**
   * Hay sesión si existe un token y no ha expirado. La validación real (firma) la hace el API
   * en cada petición; aquí solo se evita navegar con un token vencido.
   */
  isAuthenticated(): boolean {
    const exp = this.getTokenExpiration();
    if (exp === null || exp <= Date.now()) {
      if (localStorage.getItem('usuario')) {
        localStorage.removeItem('usuario');
      }
      return false;
    }
    return true;
  }

  logout() {
    const esVoluntario = !!this.getUsuario()?.usuario?.voluntario_id;
    localStorage.removeItem('usuario');
    this.router.navigate([esVoluntario ? '/voluntarios' : '/login']);
  }

}
