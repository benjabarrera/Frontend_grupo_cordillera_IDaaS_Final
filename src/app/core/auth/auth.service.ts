/**
 * AuthService (FLUJO VIEJO / DEPRECADO)
 *
 * @deprecated
 * Este servicio pertenecía al flujo de login propietario con email + contraseña
 * contra el endpoint POST /auth/login del backend. El flujo oficial de autenticación
 * HOY es Microsoft Entra ID mediante MSAL (MsalService, AuthClaimsService,
 * MsalInterceptor, MsalGuard y rolesGuard).
 *
 * El servicio se conserva únicamente porque RegisterPageComponent todavía hace
 * referencia a su método register(). La ruta /registro ya está redirigida a
 * /login en app.routes.ts. Se puede eliminar completamente en un cleanup posterior
 * junto con RegisterPageComponent.
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { RegisterRequest } from './auth.models';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/auth`;

  /**
   * @deprecated Registro de usuarios vía formulario propio reemplazado por Entra ID.
   * Conservado porque RegisterPageComponent lo importa (aunque la ruta /registro
   * ya está redirigida a /login).
   */
  register(payload: RegisterRequest): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/registro`, payload, { responseType: 'text' })
      .pipe(catchError((error) => throwError(() => new Error(this.extractErrorMessage(error)))));
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string' && error.error.trim()) {
        return error.error;
      }

      if (error.error && typeof error.error.message === 'string') {
        return error.error.message;
      }

      if (error.status === 0) {
        return 'No se pudo conectar con el backend.';
      }
    }

    return 'No fue posible completar la operacion. Intenta nuevamente.';
  }
}
