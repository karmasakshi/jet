import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';

export const routes: Routes = [
  { component: HomePageComponent, path: '' },
  {
    loadChildren: async () => (await import('./lazy.routes')).lazyRoutes,
    path: '',
  },
  {
    data: { case: 'not-found' },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component'))
        .MessagePageComponent,
    path: '**',
  },
];
