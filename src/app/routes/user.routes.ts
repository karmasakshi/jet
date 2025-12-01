import { Routes } from '@angular/router';
import { signedInGuard } from '@jet/guards/signed-in/signed-in.guard';
import { signedOutGuard } from '@jet/guards/signed-out/signed-out.guard';
import { unsavedChangesGuard } from '@jet/guards/unsaved-changes/unsaved-changes.guard';

export const userRoutes: Routes = [
  {
    data: { case: 'email-verification-pending' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: 'email-verification-pending',
  },
  {
    canActivate: [signedInGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: async () =>
      (await import('@jet/components/profile-page/profile-page.component'))
        .ProfilePageComponent,
    path: 'profile',
  },
  {
    canActivate: [signedOutGuard],
    loadComponent: async () =>
      (
        await import('@jet/components/reset-password-page/reset-password-page.component')
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
    canActivate: [signedOutGuard],
    loadComponent: async () =>
      (await import('@jet/components/sign-up-page/sign-up-page.component'))
        .SignUpPageComponent,
    path: 'sign-up',
  },
  {
    canActivate: [signedInGuard],
    canDeactivate: [unsavedChangesGuard],
    loadComponent: async () =>
      (
        await import('@jet/components/update-password-page/update-password-page.component')
      ).UpdatePasswordPageComponent,
    path: 'update-password',
  },
];
