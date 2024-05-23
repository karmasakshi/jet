import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { SettingsPageComponent } from '@jet/components/settings-page/settings-page.component';

export const routes: Routes = [
  {
    component: HomePageComponent,
    path: '',
  },
  {
    component: SettingsPageComponent,
    path: 'settings',
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
