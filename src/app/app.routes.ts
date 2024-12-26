import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { isAuthenticatedGuard } from '@jet/guards/is-authenticated/is-authenticated.guard';
import { isNotAuthenticatedGuard } from '@jet/guards/is-not-authenticated/is-not-authenticated.guard';

export const routes: Routes = [
  { component: HomePageComponent, path: '' },
  {
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import('@jet/components/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent,
      ),
    path: 'profile',
  },
  {
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: () =>
      import(
        '@jet/components/reset-password-page/reset-password-page.component'
      ).then((m) => m.ResetPasswordPageComponent),
    path: 'reset-password',
  },
  {
    loadComponent: () =>
      import('@jet/components/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
    path: 'settings',
  },
  {
    loadComponent: () =>
      import('@jet/components/sign-in-page/sign-in-page.component').then(
        (m) => m.SignInPageComponent,
      ),
    path: 'sign-in',
  },
  {
    loadComponent: () =>
      import('@jet/components/sign-out-page/sign-out-page.component').then(
        (m) => m.SignOutPageComponent,
      ),
    path: 'sign-out',
  },
  {
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: () =>
      import('@jet/components/sign-up-page/sign-up-page.component').then(
        (m) => m.SignUpPageComponent,
      ),
    path: 'sign-up',
  },
  {
    canActivate: [isAuthenticatedGuard],
    loadComponent: () =>
      import(
        '@jet/components/update-password-page/update-password-page.component'
      ).then((m) => m.UpdatePasswordPageComponent),
    path: 'update-password',
  },
  {
    loadComponent: () =>
      import('@jet/components/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
    path: '**',
  },
];
