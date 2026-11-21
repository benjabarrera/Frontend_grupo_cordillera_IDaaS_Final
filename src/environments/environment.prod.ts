// Configuración de producción.
// Este archivo reemplaza environment.ts durante ng build --configuration production.
export const environment = {
  production: true,

  // ── Microsoft Entra ID (MSAL) ─────────────────────────────────────────────
  entra: {
    tenantId: '4250abc2-359b-45d6-8fb2-732e71b2a277',
    authority: 'https://login.microsoftonline.com/4250abc2-359b-45d6-8fb2-732e71b2a277',
    clientId: '56bdffd3-eb09-474e-84f6-2dad7d3d2060',
    // En producción el redirectUri debe coincidir con el registrado en Azure para el entorno de prod.
    // Actualizar este valor al deployar.
    redirectUri: 'https://REEMPLAZAR-CON-URL-PRODUCCION',
    apiClientId: '289a7d84-7d8d-4bea-b2a8-380f6e89043a',
    apiScope: 'api://289a7d84-7d8d-4bea-b2a8-380f6e89043a/access_as_user',
  },

  // ── Backend ───────────────────────────────────────────────────────────────
  // Actualizar con la URL del gateway en producción al deployar.
  apiBaseUrl: 'https://REEMPLAZAR-CON-URL-GATEWAY-PRODUCCION',
};
