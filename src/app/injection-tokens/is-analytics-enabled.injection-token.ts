import { InjectionToken } from '@angular/core';

export const IS_ANALYTICS_ENABLED: InjectionToken<boolean> = new InjectionToken<boolean>(
  'IS_ANALYTICS_ENABLED',
  { factory: () => import.meta.env.VITE_IS_ANALYTICS_ENABLED !== 'false', providedIn: 'root' },
);
