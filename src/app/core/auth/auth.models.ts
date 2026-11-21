/**
 * Modelos del flujo de autenticación PROPIETARIO ANTERIOR (email + password).
 *
 * Hoy la autenticación se hace exclusivamente con Microsoft Entra ID (MSAL).
 * Se conservan únicamente:
 *   - `UserRole` → utilizado en AuthClaimsService, guards y lógica de visibilidad.
 *   - `RegisterRequest` → RegisterPageComponent aún hace referencia a AuthService
 *     (deshabilitado en app.routes.ts redirigiendo a /login; se puede borrar todo en un cleanup posterior).
 *
 * Los demás interfaces están deprecated y no deben usarse.
 */
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN_USUARIOS'
  | 'ADMIN_VENTAS'
  | 'ADMIN_INVENTARIO'
  | 'ADMIN_FINANZAS'
  | 'ADMIN_CLIENTES'
  | 'EJECUTIVO'
  | 'ANALISTA';

/** @deprecated Antes era parte del modelo del backend propietario. Sin uso actualmente. */
export type UserStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'BLOQUEADO';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** @deprecated Flujo de login propio reemplazado por MSAL. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** @deprecated Flujo de login propio reemplazado por MSAL. */
export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  rol: UserRole;
}

/** @deprecated Reemplazado por la caché de MSAL en sessionStorage. Sin uso. */
export interface UserSession extends LoginResponse {
  authenticatedAt: string;
}
