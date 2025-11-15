import { InjectionToken } from '@angular/core';

export const IS_LOGGING_ENABLED: InjectionToken<boolean> =
  new InjectionToken<boolean>('IS_LOGGING_ENABLED', {
    factory: () => import.meta.env?.NG_APP_IS_LOGGING_ENABLED === 'true',
    providedIn: 'root',
  });
