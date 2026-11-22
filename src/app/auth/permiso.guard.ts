import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

/**
 * Exige un privilegio de acceso (rol con ruta) para abrir la pantalla.
 * Uso en la ruta: { ..., canActivate: [AuthGuard, permisoGuard], data: { permiso: 'MANT_ORDENES' } }
 * data.permiso puede ser un código o una lista (basta con tener uno).
 */
export const permisoGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requerido = route.data?.['permiso'] as string | string[] | undefined;
  if (!requerido) {
    return true;
  }
  const codigos = Array.isArray(requerido) ? requerido : [requerido];
  if (auth.tienePermiso(...codigos)) {
    return true;
  }
  Swal.fire('Sin acceso', 'No tiene el privilegio para abrir esta pantalla. Solicítelo al administrador del sistema.', 'warning');
  return router.parseUrl('/dashboard');
};
