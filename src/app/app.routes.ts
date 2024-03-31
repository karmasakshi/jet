import { Routes } from '@angular/router';
import { HomePageComponent } from '@xxx/components/home-page/home-page.component';
import { SettingsPageComponent } from '@xxx/components/settings-page/settings-page.component';

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
    pathMatch: 'full',
    redirectTo: '/',
  },
];
