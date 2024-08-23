import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';

export const routes: Routes = [
  { component: HomePageComponent, path: '' },
  {
    loadComponent: () =>
      import('@jet/components/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
    path: 'settings',
  },
  { path: '**', redirectTo: '/' },
];
