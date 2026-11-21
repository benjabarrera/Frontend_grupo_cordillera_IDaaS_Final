import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private readonly msalService = inject(MsalService);

  protected readonly isLoggingIn = signal(false);
  protected readonly errorMessage = signal('');

  /** Inicia el flujo OAuth 2.0 Authorization Code (PKCE) con redirect a Microsoft. */
  protected loginWithMicrosoft(): void {
    this.isLoggingIn.set(true);
    this.errorMessage.set('');

    this.msalService
      .loginRedirect({
        // Scopes de identidad + scope de la API para obtener el access token
        // con los roles del usuario en el mismo flujo.
        scopes: ['openid', 'profile', environment.entra.apiScope],
      })
      .subscribe({
        error: (err: Error) => {
          this.isLoggingIn.set(false);
          this.errorMessage.set(
            err.message || 'No se pudo iniciar el flujo de autenticación. Intenta nuevamente.',
          );
        },
      });
  }
}
