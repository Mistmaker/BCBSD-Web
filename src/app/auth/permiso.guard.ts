import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

/**
 * Exige el privilegio de acceso a la pantalla.
 * Uso en la ruta: { ..., canActivate: [AuthGuard, permisoGuard], data: { permiso: 'MANT_ORDENES' } }
 *
 * En cada navegación se consultan al API los privilegios ACTUALES del usuario (un privilegio asignado o quitado
 * con la sesión abierta se aplica de inmediato). Se permite si tiene el código (data.permiso, uno o varios) o un
 * rol cuya ruta cubre la URL (la misma regla del menú). Si se niega, también se recarga el menú, que pudo quedar
 * desactualizado. Si el API no responde, se decide con los privilegios guardados en la sesión.
 */
export const permisoGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requerido = route.data?.['permiso'] as string | string[] | undefined;
  if (!requerido) {
    return true;
  }
  const codigos = Array.isArray(requerido) ? requerido : [requerido];
  const decidir = () => {
    if (auth.tienePermiso(...codigos) || auth.tieneAccesoRuta(state?.url ?? '')) {
      return true;
    }
    auth.notificarCambioPrivilegios();
    Swal.fire('Sin acceso', 'No tiene el privilegio para abrir esta pantalla. Solicítelo al administrador del sistema.', 'warning');
    return router.parseUrl('/dashboard');
  };
  return auth.refrescarPermisos().pipe(
    map(() => decidir()),
    catchError(() => of(decidir()))
  );
};
