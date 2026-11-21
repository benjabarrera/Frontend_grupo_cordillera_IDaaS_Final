import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { LandingPageComponent } from './pages/landing/landing-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { AccessDeniedPageComponent } from './pages/access-denied/access-denied-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'Grupo Cordillera | Inicio',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard],
    title: 'Grupo Cordillera | Login',
  },
  {
    // El registro de usuarios ahora se gestiona en Azure Entra ID.
    // Esta ruta redirige al login para evitar acceder a una página sin función.
    path: 'registro',
    redirectTo: 'login',
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [authGuard],
    title: 'Grupo Cordillera | Dashboard',
  },
  {
    path: 'acceso-denegado',
    component: AccessDeniedPageComponent,
    title: 'Grupo Cordillera | Acceso denegado',
  },
  {
    path: '**',
    redirectTo: '',
  },
];