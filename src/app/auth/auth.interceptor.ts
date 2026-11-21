import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const RUTAS_LOGIN = ['/servicios/auth/login.php', '/servicios/auth/loginVoluntarios.php'];

/**
 * Agrega "Authorization: Bearer <token>" a las peticiones dirigidas al API
 * y cierra la sesión si el API responde 401 (token vencido o inválido).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const esApi = req.url.startsWith(environment.API_URL);
  const esLogin = RUTAS_LOGIN.some(ruta => req.url.includes(ruta));

  const token = esApi && !esLogin ? auth.getToken() : null;
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (esApi && !esLogin && error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
        Swal.fire('Sesión finalizada', 'Su sesión expiró o no es válida. Inicie sesión nuevamente.', 'warning');
      }
      return throwError(() => error);
    })
  );
};
