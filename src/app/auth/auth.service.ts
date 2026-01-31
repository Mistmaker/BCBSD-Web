import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { usuario: string; password: string }) {
    return this.http.post<any>(`${environment.API_URL}/servicios/auth/login.php`, credentials);
  }

  setSession(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): any {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  getRoles(usuario_id: number): any {
    // const userRoles = JSON.parse(localStorage.getItem('usuario') || '{}');
    // http://localhost/cbsd-api/servicios/auth/getRoles.php?id=113
    this.http.get(`${environment.API_URL}/auth/getRoles.php?id=${usuario_id}`).subscribe({
      next: (data) =>{ return data},
      error: (e) => {
        console.error(e);
      },
      complete: () => console.info('complete')
    })
    // return userRoles.usuario.roles;
  }

  ExisteRol(rol_id: number): boolean {
    const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
    const roles = userData.usuario.roles
    // const roles = this.getRoles(113)
    console.log(roles)
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
