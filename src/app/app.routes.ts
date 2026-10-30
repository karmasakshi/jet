import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';

export const routes: Routes = [
  { component: HomePageComponent, path: '', pathMatch: 'full' },
  { loadChildren: async () => (await import('./lazy.routes')).lazyRoutes, path: '' },
  {
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component')).MessagePageComponent,
    path: '**',
  },
];
