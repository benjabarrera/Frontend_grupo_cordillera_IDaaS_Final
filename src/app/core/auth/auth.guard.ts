/**
 * authGuard
 *
 * Protege rutas privadas verificando que el usuario tenga una sesión activa
 * en Entra ID. El check es sincrónico porque el APP_INITIALIZER ya procesó
 * handleRedirectPromise() antes de que el router arranque — por lo tanto,
 * las cuentas MSAL ya están en caché cuando este guard evalúa.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = () => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const accounts = msalService.instance.getAllAccounts();

  if (accounts.length > 0) {
    // Establece la cuenta activa si aún no lo está (necesario para acquireTokenSilent).
    if (!msalService.instance.getActiveAccount()) {
      msalService.instance.setActiveAccount(accounts[0]);
    }
    return true;
  }

  // Sin sesión → redirigir al login con Microsoft.
  return router.createUrlTree(['/login']);
};
