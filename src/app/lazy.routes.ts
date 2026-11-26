import { Routes } from '@angular/router';
import { PAGE_METADATAS } from '@jet/constants/page-metadatas.constant';
import { hasEmailGuard } from '@jet/guards/has-email/has-email.guard';
import { hasUnsavedChangesGuard } from '@jet/guards/has-unsaved-changes/has-unsaved-changes.guard';
import { isSignedInGuard } from '@jet/guards/is-signed-in/is-signed-in.guard';
import { isSignedOutGuard } from '@jet/guards/is-signed-out/is-signed-out.guard';
import { ProfileService } from '@jet/services/profile/profile.service';

export const lazyRoutes: Routes = [
  {
    data: {
      case: 'email-verification-pending',
      pageMetadata: PAGE_METADATAS['/email-verification-pending'],
    },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component')).MessagePageComponent,
    path: 'email-verification-pending',
  },
  {
    canActivate: [isSignedInGuard],
    canDeactivate: [hasUnsavedChangesGuard],
    data: { pageMetadata: PAGE_METADATAS['/profile'] },
    loadComponent: async () =>
      (await import('@jet/components/profile-page/profile-page.component')).ProfilePageComponent,
    path: 'profile',
    providers: [ProfileService],
  },
  {
    canActivate: [isSignedOutGuard],
    canDeactivate: [hasUnsavedChangesGuard],
    data: { pageMetadata: PAGE_METADATAS['/reset-password'] },
    loadComponent: async () =>
      (await import('@jet/components/reset-password-page/reset-password-page.component'))
        .ResetPasswordPageComponent,
    path: 'reset-password',
  },
  {
    data: {
      case: 'reset-password-email-sent',
      pageMetadata: PAGE_METADATAS['/reset-password-email-sent'],
    },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component')).MessagePageComponent,
    path: 'reset-password-email-sent',
  },
  {
    data: { pageMetadata: PAGE_METADATAS['/settings'] },
    loadComponent: async () =>
      (await import('@jet/components/settings-page/settings-page.component')).SettingsPageComponent,
    path: 'settings',
  },
  {
    data: { pageMetadata: PAGE_METADATAS['/sign-in'] },
    loadComponent: async () =>
      (await import('@jet/components/sign-in-page/sign-in-page.component')).SignInPageComponent,
    path: 'sign-in',
  },
  {
    data: { case: 'sign-in-link-sent', pageMetadata: PAGE_METADATAS['/sign-in-link-sent'] },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component')).MessagePageComponent,
    path: 'sign-in-link-sent',
  },
  {
    canActivate: [isSignedInGuard],
    data: { pageMetadata: PAGE_METADATAS['/sign-out'] },
    loadComponent: async () =>
      (await import('@jet/components/sign-out-page/sign-out-page.component')).SignOutPageComponent,
    path: 'sign-out',
  },
  {
    canActivate: [isSignedOutGuard],
    canDeactivate: [hasUnsavedChangesGuard],
    data: { pageMetadata: PAGE_METADATAS['/sign-up'] },
    loadComponent: async () =>
      (await import('@jet/components/sign-up-page/sign-up-page.component')).SignUpPageComponent,
    path: 'sign-up',
  },
  {
    canActivate: [isSignedInGuard, hasEmailGuard],
    canDeactivate: [hasUnsavedChangesGuard],
    data: { pageMetadata: PAGE_METADATAS['/update-password'] },
    loadComponent: async () =>
      (await import('@jet/components/update-password-page/update-password-page.component'))
        .UpdatePasswordPageComponent,
    path: 'update-password',
  },
];
