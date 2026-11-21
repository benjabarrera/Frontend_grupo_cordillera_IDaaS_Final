// Configuración de desarrollo.
// Los valores de producción se reemplazan por environment.prod.ts
// gracias al fileReplacements configurado en angular.json.
export const environment = {
  production: false,

  // ── Microsoft Entra ID (MSAL) ─────────────────────────────────────────────
  // Tenant ID de la organización Grupo Cordillera
  entra: {
    tenantId: '4250abc2-359b-45d6-8fb2-732e71b2a277',
    authority: 'https://login.microsoftonline.com/4250abc2-359b-45d6-8fb2-732e71b2a277',
    // Client ID del registro de la SPA en Entra ID
    clientId: '56bdffd3-eb09-474e-84f6-2dad7d3d2060',
    // Redirect URI registrada como tipo SPA en el portal de Azure
    redirectUri: 'http://localhost:4200',
    // Client ID de la API expuesta (api-gateway backend)
    apiClientId: '289a7d84-7d8d-4bea-b2a8-380f6e89043a',
    // Scope de la API que se solicita al adquirir access tokens
    apiScope: 'api://289a7d84-7d8d-4bea-b2a8-380f6e89043a/access_as_user',
  },

  // ── Backend ───────────────────────────────────────────────────────────────
  apiBaseUrl: 'http://localhost:8080',
};
