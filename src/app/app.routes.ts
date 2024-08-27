import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { authenticatedGuard } from '@jet/guards/authenticated/authenticated.guard';

export const routes: Routes = [
  { component: HomePageComponent, path: '' },
  {
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@jet/components/account-page/account-page.component').then(
        (m) => m.AccountPageComponent,
      ),
    path: 'account',
  },
  {
    loadComponent: () =>
      import('@jet/components/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
    path: 'login',
  },
  {
    loadComponent: () =>
      import('@jet/components/logout-page/logout-page.component').then(
        (m) => m.LogoutPageComponent,
      ),
    path: 'logout',
  },
  {
    loadComponent: () =>
      import('@jet/components/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
    path: 'settings',
  },
  { path: '**', redirectTo: '/' },
];
