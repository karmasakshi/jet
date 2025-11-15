import { InjectionToken } from '@angular/core';

export const IS_ANALYTICS_ENABLED: InjectionToken<boolean> =
  new InjectionToken<boolean>('IS_ANALYTICS_ENABLED', {
    factory: () => import.meta.env?.NG_APP_IS_ANALYTICS_ENABLED === 'true',
    providedIn: 'root',
  });
