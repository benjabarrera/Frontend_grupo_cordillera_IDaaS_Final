/**
 * guestGuard
 *
 * Permite acceso solo a usuarios NO autenticados (login).
 * Si el usuario ya tiene sesión activa en Entra ID, redirige al dashboard.
 * Check sincrónico — ver authGuard para la justificación.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const guestGuard: CanActivateFn = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const isAuthenticated = msalService.instance.getAllAccounts().length > 0;

  if (!isAuthenticated) {
    return true;
  }

  // Usuario ya autenticado → redirigir al dashboard.
  return router.createUrlTree(['/dashboard']);
};
