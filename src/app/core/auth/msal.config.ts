/**
 * msal.config.ts
 *
 * Centraliza la creación del PublicClientApplication y los providers de MSAL
 * para ser importados en app.config.ts.
 *
 * Documentación oficial:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular
 */

import {
  BrowserCacheLocation,
  InteractionType,
  LogLevel,
  PublicClientApplication,
  type IPublicClientApplication,
} from '@azure/msal-browser';

import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalService,
} from '@azure/msal-angular';

import { environment } from '../../../environments/environment';

// ── Instancia del PublicClientApplication ──────────────────────────────────

export function msalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.entra.clientId,
      authority: environment.entra.authority,
      redirectUri: environment.entra.redirectUri,
      // postLogoutRedirectUri se establece en la Etapa 2 (logout).
      postLogoutRedirectUri: environment.entra.redirectUri,
    },
    cache: {
      // sessionStorage: los tokens se limpian al cerrar la pestaña/navegador.
      cacheLocation: BrowserCacheLocation.SessionStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) return;
          if (!environment.production) {
            switch (level) {
              case LogLevel.Error:   console.error('[MSAL]', message); break;
              case LogLevel.Warning: console.warn('[MSAL]', message);  break;
              case LogLevel.Info:    console.info('[MSAL]', message);  break;
              case LogLevel.Verbose: console.debug('[MSAL]', message); break;
            }
          }
        },
        piiLoggingEnabled: false,
        logLevel: environment.production ? LogLevel.Error : LogLevel.Warning,
      },
    },
  });
}

// ── Guard config: loginRedirect al acceder a rutas protegidas ──────────────

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      // Scopes básicos de identidad. El scope de la API se agrega en Etapa 3
      // cuando se adquiere el access token para llamadas al gateway.
      scopes: ['openid', 'profile'],
    },
    // loginFailedRoute se configura en Etapa 4 junto con el guard de roles.
  };
}

// ── Interceptor config: protege llamadas al backend con el access token ─────

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  // Solo el gateway recibe el Bearer token.
  // Ningún otro dominio (ej.: Metabase) debe recibirlo.
  //
  // IMPORTANTE strictMatching:
  //   - La clave termina en /* para que coincida con CUALQUIER subruta del
  //     gateway (ej.: /inventario, /alertas/resumen, /ventas, etc.).
  //   - Se establece strictMatching: false explícitamente para eliminar
  //     el warning de consola y asegurar matching por prefijo.
  //   Sin este ajuste MsalInterceptor NO adjunta Authorization y el backend
  //   responde 401 (que el navegador reporta como "bloqueado por CORS").
  const protectedResourceMap = new Map<string, string[]>([
    [`${environment.apiBaseUrl}/*`, [environment.entra.apiScope]],
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
    strictMatching: false,
  };
}

// ── Providers listos para usar en app.config.ts ────────────────────────────

export const msalProviders = [
  {
    provide: MSAL_INSTANCE,
    useFactory: msalInstanceFactory,
  },
  {
    provide: MSAL_GUARD_CONFIG,
    useFactory: msalGuardConfigFactory,
  },
  {
    provide: MSAL_INTERCEPTOR_CONFIG,
    useFactory: msalInterceptorConfigFactory,
  },
  MsalService,
  MsalGuard,
  MsalBroadcastService,
];
