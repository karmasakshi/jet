import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    loadComponent: () =>
      import('@jet/components/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
    path: '',
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
