import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'email-verification-pending', renderMode: RenderMode.Prerender },
  { path: 'profile', renderMode: RenderMode.Prerender },
  { path: 'reset-password', renderMode: RenderMode.Prerender },
  { path: 'reset-password-email-sent', renderMode: RenderMode.Prerender },
  { path: 'settings', renderMode: RenderMode.Prerender },
  { path: 'sign-in', renderMode: RenderMode.Prerender },
  { path: 'sign-in-link-sent', renderMode: RenderMode.Prerender },
  { path: 'sign-out', renderMode: RenderMode.Prerender },
  { path: 'sign-up', renderMode: RenderMode.Prerender },
  { path: 'update-password', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
