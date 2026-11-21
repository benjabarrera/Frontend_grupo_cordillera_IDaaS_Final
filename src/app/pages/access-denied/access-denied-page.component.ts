import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied-page',
  imports: [RouterLink],
  template: `
    <main class="denied-shell">
      <div class="denied-glow glow-left" aria-hidden="true"></div>
      <div class="denied-glow glow-right" aria-hidden="true"></div>

      <section class="denied-card">
        <span class="denied-code" aria-hidden="true">403</span>
        <h1>Acceso denegado</h1>
        <p>
          Tu rol no tiene permisos para acceder a esta sección.<br />
          Si crees que es un error, contacta al administrador del sistema.
        </p>
        <a class="button button-primary" routerLink="/dashboard">
          Volver al dashboard
        </a>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; }

    .denied-shell {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(255, 80, 80, 0.12), transparent 35%),
        radial-gradient(circle at bottom right, rgba(63, 102, 245, 0.14), transparent 32%),
        linear-gradient(180deg, var(--app-bg-elevated) 0%, var(--app-bg) 100%);
      color: var(--app-text);
    }

    .denied-glow {
      position: absolute;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      filter: blur(58px);
      opacity: 0.25;
      pointer-events: none;
    }

    .glow-left  { top: -80px;    left: -100px; background: rgba(255, 80, 80, 0.4); }
    .glow-right { bottom: -80px; right: -80px; background: rgba(63, 102, 245, 0.3); }

    .denied-card {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 20px;
      padding: 48px;
      max-width: 500px;
      text-align: center;
      border: 1px solid var(--app-border);
      border-radius: 28px;
      background: linear-gradient(180deg, var(--app-surface) 0%, var(--app-surface-2) 100%);
      box-shadow: var(--app-shadow);
      backdrop-filter: blur(18px);
    }

    .denied-code {
      font-size: 5rem;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(135deg, #ff6b6b, #ff8f8f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    h1 { margin: 0; font-size: 1.8rem; }

    p { margin: 0; color: var(--app-text-soft); line-height: 1.7; }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      min-height: 48px;
      border-radius: 14px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .button:hover { transform: translateY(-2px); }

    .button-primary {
      background: linear-gradient(135deg, #1ed6bc 0%, #15999b 100%);
      color: #03111f;
      box-shadow: 0 12px 30px rgba(30, 214, 188, 0.22);
    }
  `],
})
export class AccessDeniedPageComponent {}
