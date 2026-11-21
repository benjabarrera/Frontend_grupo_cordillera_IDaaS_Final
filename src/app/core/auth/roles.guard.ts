/**
 * rolesGuard
 *
 * Guard secundario (aplica DESPUÉS de authGuard) que verifica que el usuario
 * tenga al menos uno de los roles requeridos definidos en route.data['roles'].
 *
 * Uso en app.routes.ts:
 *   {
 *     path: 'admin',
 *     canActivate: [authGuard, rolesGuard],
 *     data: { roles: ['SUPER_ADMIN', 'ADMIN_USUARIOS'] as UserRole[] },
 *   }
 *
 * IMPORTANTE: Esta verificación es solo una medida de UX.
 * La autorización real la aplica el backend (API Gateway) en cada request HTTP.
 */

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthClaimsService } from './auth-claims.service';
import { UserRole } from './auth.models';

export const rolesGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authClaimsService = inject(AuthClaimsService);
  const router = inject(Router);

  // Roles requeridos declarados en route.data['roles'].
  const requiredRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];

  // Si la ruta no declara roles requeridos, se permite el acceso.
  if (requiredRoles.length === 0) {
    return true;
  }

  // Asegurar que los claims estén cargados.
  if (!authClaimsService.loaded()) {
    authClaimsService.loadClaims();
  }

  if (authClaimsService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Sin el rol requerido → acceso denegado.
  return router.createUrlTree(['/acceso-denegado']);
};
