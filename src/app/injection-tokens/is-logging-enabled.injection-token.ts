import { InjectionToken } from '@angular/core';

export const IS_LOGGING_ENABLED: InjectionToken<boolean> = new InjectionToken<boolean>(
  'IS_LOGGING_ENABLED',
  { factory: () => import.meta.env.VITE_IS_LOGGING_ENABLED !== 'false', providedIn: 'root' },
);
