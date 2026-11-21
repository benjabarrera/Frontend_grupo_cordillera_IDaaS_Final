import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MsalInterceptor, MsalService } from '@azure/msal-angular';

import { msalProviders } from './core/auth/msal.config';
import { routes } from './app.routes';

/**
 * Inicializa MSAL y procesa el hash del redirect de Entra ID antes de que
 * arranque la aplicación. Patrón oficial para apps standalone con msal-angular v6:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/initialization.md
 */
function msalInitializerFactory(msalService: MsalService) {
  return () =>
    msalService.instance
      .initialize()
      .then(() => msalService.instance.handleRedirectPromise());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // HTTP client con soporte para interceptores basados en DI (MsalInterceptor).
    provideHttpClient(
      withInterceptorsFromDi(),
    ),

    provideRouter(routes),

    // ── MSAL providers ────────────────────────────────────────────────────
    ...msalProviders,

    // Inicializa MSAL y resuelve el redirect antes del bootstrap.
    {
      provide: APP_INITIALIZER,
      useFactory: msalInitializerFactory,
      deps: [MsalService],
      multi: true,
    },

    // Adjunta automáticamente el Bearer token de Entra ID a las llamadas
    // al gateway (protectedResourceMap definido en msal.config.ts).
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
  ],
};

