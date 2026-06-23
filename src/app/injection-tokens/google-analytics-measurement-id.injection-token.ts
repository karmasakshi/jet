import { InjectionToken } from '@angular/core';

export const GOOGLE_ANALYTICS_MEASUREMENT_ID: InjectionToken<string> = new InjectionToken<string>(
  'GOOGLE_ANALYTICS_MEASUREMENT_ID',
  { factory: () => import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID, providedIn: 'root' },
);
