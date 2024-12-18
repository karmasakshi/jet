import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { isAuthenticatedGuard } from '@jet/guards/is-authenticated/is-authenticated.guard';

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
    loadComponent: () =>
      import('@jet/components/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
    path: '**',
  },
];
