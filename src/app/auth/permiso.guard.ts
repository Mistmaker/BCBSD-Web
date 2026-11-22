import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

/**
 * Exige el privilegio de acceso a la pantalla.
 * Uso en la ruta: { ..., canActivate: [AuthGuard, permisoGuard], data: { permiso: 'MANT_ORDENES' } }
 * Se permite si el usuario tiene el código (data.permiso, uno o varios) o un rol cuya ruta cubre la URL
 * (la misma regla del menú). Si no, se consultan los privilegios actuales al API antes de negar el acceso,
 * para que un privilegio recién asignado funcione sin volver a iniciar sesión.
 */
export const permisoGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requerido = route.data?.['permiso'] as string | string[] | undefined;
  if (!requerido) {
    return true;
  }
  const codigos = Array.isArray(requerido) ? requerido : [requerido];
  const permitido = () => auth.tienePermiso(...codigos) || auth.tieneAccesoRuta(state?.url ?? '');
  const negar = () => {
    Swal.fire('Sin acceso', 'No tiene el privilegio para abrir esta pantalla. Solicítelo al administrador del sistema.', 'warning');
    return router.parseUrl('/dashboard');
  };
  if (permitido()) {
    return true;
  }
  return auth.refrescarPermisos().pipe(
    map(() => permitido() ? true : negar()),
    catchError(() => of(negar()))
  );
};
