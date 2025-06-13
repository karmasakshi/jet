import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { isAuthenticatedGuard } from '@jet/guards/is-authenticated/is-authenticated.guard';
import { isNotAuthenticatedGuard } from '@jet/guards/is-not-authenticated/is-not-authenticated.guard';

const mainRoutes: Routes = [{ component: HomePageComponent, path: '' }];

const userRoutes: Routes = [
  {
    data: { case: 'email-verification-pending' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: 'email-verification-pending',
  },
  {
    canActivate: [isAuthenticatedGuard],
    loadComponent: async () =>
      (await import('@jet/components/profile-page/profile-page.component'))
        .ProfilePageComponent,
    path: 'profile',
  },
  {
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: async () =>
      (await import('@jet/components/reset-password-page/reset-password-page'))
        .ResetPasswordPage,
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
      (await import('@jet/components/settings-page/settings-page'))
        .SettingsPage,
    path: 'settings',
  },
  {
    loadComponent: async () =>
      (await import('@jet/components/sign-in-page/sign-in-page')).SignInPage,
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
      (await import('@jet/components/sign-out-page/sign-out-page')).SignOutPage,
    path: 'sign-out',
  },
  {
    canActivate: [isNotAuthenticatedGuard],
    loadComponent: async () =>
      (await import('@jet/components/sign-up-page/sign-up-page')).SignUpPage,
    path: 'sign-up',
  },
  {
    canActivate: [isAuthenticatedGuard],
    loadComponent: async () =>
      (
        await import(
          '@jet/components/update-password-page/update-password-page'
        )
      ).UpdatePasswordPage,
    path: 'update-password',
  },
];

export const routes: Routes = [
  ...mainRoutes,
  ...userRoutes,
  {
    data: { case: 'not-found' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: '**',
  },
];
