import { InjectionToken, isDevMode } from '@angular/core';

export const IS_ANALYTICS_ENABLED: InjectionToken<boolean> =
  new InjectionToken<boolean>('IS_ANALYTICS_ENABLED', {
    factory: (): boolean => !isDevMode(),
    providedIn: 'root',
  });
