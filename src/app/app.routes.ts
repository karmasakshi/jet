import { Routes } from '@angular/router';
import { isAuthenticated } from '@jet/guards/is-authenticated/is-authenticated.guard';
import { isNotAuthenticated } from '@jet/guards/is-not-authenticated/is-not-authenticated.guard';
import { HomePage } from './components/home-page/home-page';

const mainRoutes: Routes = [{ component: HomePage, path: '' }];

const userRoutes: Routes = [
  {
    data: { case: 'email-verification-pending' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page')).MessagePage,
    path: 'email-verification-pending',
  },
  {
    canActivate: [isAuthenticated],
    loadComponent: async () =>
      (await import('@jet/components/profile-page/profile-page')).ProfilePage,
    path: 'profile',
  },
  {
    canActivate: [isNotAuthenticated],
    loadComponent: async () =>
      (await import('@jet/components/reset-password-page/reset-password-page'))
        .ResetPasswordPage,
    path: 'reset-password',
  },
  {
    data: { case: 'reset-password-email-sent' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page')).MessagePage,
    path: 'reset-password-email-sent',
  },
  {
    loadComponent: async () =>
      (await import('@jet/components/settings-page/settings-page'))
        .SettingsPage,
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
      (await import('@jet/components/message-page/message-page')).MessagePage,
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

export const routes: Routes = [
  ...mainRoutes,
  ...userRoutes,
  {
    data: { case: 'not-found' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page')).MessagePage,
    path: '**',
  },
];
