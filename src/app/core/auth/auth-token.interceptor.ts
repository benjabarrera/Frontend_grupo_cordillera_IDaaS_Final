/**
 * auth-token.interceptor.ts
 *
 * ELIMINADO en Etapa 4 de la migración a Microsoft Entra ID (MSAL).
 *
 * Este interceptor adjuntaba el JWT propio del backend Spring Boot al header
 * Authorization de cada request HTTP. Con MSAL, esa responsabilidad la asume
 * MsalInterceptor (configurado en app.config.ts con el protectedResourceMap).
 *
 * El archivo se conserva vacío para evitar errores de compilación si quedara
 * alguna referencia residual. Se puede eliminar en el siguiente cleanup.
 */

import { HttpInterceptorFn } from '@angular/common/http';

/** @deprecated Reemplazado por MsalInterceptor. No hace nada. */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => next(req);
