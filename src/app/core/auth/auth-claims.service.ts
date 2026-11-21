/**
 * AuthClaimsService
 *
 * Obtiene el access token de Entra ID para el scope de la API mediante
 * acquireTokenSilent y expone los claims relevantes como signals de Angular.
 *
 * IMPORTANTE: Las funciones hasRole / hasAnyRole controlan SOLO la visibilidad
 * de elementos en la interfaz (UX). La autorización real es responsabilidad
 * exclusiva del backend (API Gateway), que valida el token en cada request.
 */

import { Injectable, inject, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

import { UserRole } from './auth.models';
import { environment } from '../../../environments/environment';

/** Roles válidos tal como llegan en el claim "roles" del access token. */
const VALID_ROLES: ReadonlySet<string> = new Set<UserRole>([
  'SUPER_ADMIN',
  'ADMIN_USUARIOS',
  'ADMIN_VENTAS',
  'ADMIN_INVENTARIO',
  'ADMIN_FINANZAS',
  'ADMIN_CLIENTES',
  'EJECUTIVO',
  'ANALISTA',
]);

@Injectable({ providedIn: 'root' })
export class AuthClaimsService {
  private readonly msalService = inject(MsalService);

  // ── Signals privados (escritura interna) ──────────────────────────────────
  private readonly _roles = signal<UserRole[]>([]);
  private readonly _scopes = signal<string[]>([]);
  private readonly _loaded = signal(false);
  private readonly _error = signal<string | null>(null);

  // ── Signals públicos (solo lectura) ──────────────────────────────────────

  /** Roles del usuario, leídos del claim "roles" del access token de la API. */
  readonly roles = this._roles.asReadonly();

  /** Scopes habilitados, leídos del claim "scp" del access token de la API. */
  readonly scopes = this._scopes.asReadonly();

  /** True cuando los claims ya fueron cargados al menos una vez. */
  readonly loaded = this._loaded.asReadonly();

  /** Mensaje de error si acquireTokenSilent falla por razón no interactiva. */
  readonly error = this._error.asReadonly();

  // ── API pública ───────────────────────────────────────────────────────────

  /**
   * Comprueba si el usuario autenticado tiene un rol específico.
   *
   * NOTA: Esta verificación es solo visual (UX). La autorización real
   * la aplica el backend en cada request HTTP.
   */
  hasRole(role: UserRole): boolean {
    return this._roles().includes(role);
  }

  /**
   * Comprueba si el usuario autenticado tiene al menos uno de los roles dados.
   *
   * NOTA: Esta verificación es solo visual (UX). La autorización real
   * la aplica el backend en cada request HTTP.
   */
  hasAnyRole(roles: readonly UserRole[]): boolean {
    return roles.some((r) => this._roles().includes(r));
  }

  /**
   * Obtiene el access token para el scope de la API mediante acquireTokenSilent
   * (lee del caché de sessionStorage si el token aún es válido, sin red).
   * Decodifica el payload y actualiza los signals roles / scopes.
   *
   * Si el token expiró o se necesita consentimiento interactivo,
   * lanza acquireTokenRedirect para renovar en Microsoft.
   */
  loadClaims(): void {
    const account =
      this.msalService.instance.getActiveAccount() ??
      this.msalService.instance.getAllAccounts()[0] ??
      null;

    if (!account) {
      // No hay sesión activa: no hay nada que cargar.
      return;
    }

    this.msalService
      .acquireTokenSilent({
        scopes: [environment.entra.apiScope],
        account,
      })
      .subscribe({
        next: (result) => {
          const payload = this.decodeJwtPayload(result.accessToken);

          // claim "roles" → array de strings
          const rawRoles = payload['roles'];
          this._roles.set(
            Array.isArray(rawRoles)
              ? (rawRoles as string[]).filter((r): r is UserRole => VALID_ROLES.has(r))
              : [],
          );

          // claim "scp" → string separado por espacios
          const rawScp = payload['scp'];
          this._scopes.set(
            typeof rawScp === 'string' && rawScp.trim().length > 0
              ? rawScp.split(' ')
              : [],
          );

          this._loaded.set(true);
          this._error.set(null);
        },

        error: (err: unknown) => {
          if (err instanceof InteractionRequiredAuthError) {
            // El token expiró o se requiere consentimiento: redirige a Microsoft.
            // La app volverá al redirectUri y el APP_INITIALIZER lo procesará.
            this.msalService
              .acquireTokenRedirect({
                scopes: [environment.entra.apiScope],
              })
              .subscribe();
          } else {
            // Error no interactivo (ej: sin conexión). Se registra pero no se lanza.
            const message =
              err instanceof Error ? err.message : 'Error al obtener claims del token.';
            this._error.set(message);
            console.error('[AuthClaimsService] acquireTokenSilent error:', err);
          }
        },
      });
  }

  // ── Utilidades privadas ───────────────────────────────────────────────────

  /**
   * Decodifica el payload de un JWT sin validar la firma.
   * La validación de firma es responsabilidad del backend.
   *
   * @param token JWT en formato header.payload.signature (base64url)
   */
  private decodeJwtPayload(token: string): Record<string, unknown> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {};
      }
      // base64url → base64 estándar
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Padding necesario para atob
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
}
