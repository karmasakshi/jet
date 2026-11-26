import { Routes } from '@angular/router';
import { HomePageComponent } from '@jet/components/home-page/home-page.component';
import { PAGE_METADATAS } from '@jet/constants/page-metadatas.constant';

export const routes: Routes = [
  { component: HomePageComponent, data: { pageMetadata: PAGE_METADATAS['/'] }, path: '' },
  { loadChildren: async () => (await import('./lazy.routes')).lazyRoutes, path: '' },
  {
    data: { pageMetadata: PAGE_METADATAS['/**'] },
    loadComponent: async () =>
      (await import('@jet/components/message-page/message-page.component')).MessagePageComponent,
    path: '**',
  },
];
