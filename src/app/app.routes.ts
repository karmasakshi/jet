import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { isAuthenticated } from '@jet/guards/is-authenticated/is-authenticated.guard';
import { isNotAuthenticated } from '@jet/guards/is-not-authenticated/is-not-authenticated.guard';

const generalRoutes: Routes = [
  {
    data: { case: 'email-verification-pending' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: 'email-verification-pending',
  },
  {
    canActivate: [isAuthenticated],
    loadComponent: async () =>
      (await import('@jet/components/profile-page/profile-page.component'))
        .ProfilePageComponent,
    path: 'profile',
  },
  {
    canActivate: [isNotAuthenticated],
    loadComponent: async () =>
      (
        await import(
          '@jet/components/reset-password-page/reset-password-page.component'
        )
      ).ResetPasswordPageComponent,
    path: 'reset-password',
  },
  {
    data: { case: 'reset-password-email-sent' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: 'reset-password-email-sent',
  },
  {
    loadComponent: async () =>
      (await import('@jet/components/settings-page/settings-page.component'))
        .SettingsPageComponent,
    path: 'settings',
  },
  {
    loadComponent: async () =>
      (await import('@jet/components/sign-in-page/sign-in-page.component'))
        .SignInPageComponent,
    path: 'sign-in',
  },
  {
    data: { case: 'sign-in-link-sent' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: 'sign-in-link-sent',
  },
  {
    loadComponent: async () =>
      (await import('@jet/components/sign-out-page/sign-out-page.component'))
        .SignOutPageComponent,
    path: 'sign-out',
  },
  {
    canActivate: [isNotAuthenticated],
    loadComponent: async () =>
      (await import('@jet/components/sign-up-page/sign-up-page.component'))
        .SignUpPageComponent,
    path: 'sign-up',
  },
  {
    canActivate: [isAuthenticated],
    loadComponent: async () =>
      (
        await import(
          '@jet/components/update-password-page/update-password-page.component'
        )
      ).UpdatePasswordPageComponent,
    path: 'update-password',
  },
];

const mainRoutes: Routes = [{ component: HomePageComponent, path: '' }];

export const routes: Routes = [
  ...mainRoutes,
  ...generalRoutes,
  {
    loadComponent: async () =>
      (await import('@jet/components/not-found-page/not-found-page.component'))
        .NotFoundPageComponent,
    path: '**',
  },
];
