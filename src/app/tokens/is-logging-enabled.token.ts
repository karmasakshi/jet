import { InjectionToken, isDevMode } from '@angular/core';

export const IS_LOGGING_ENABLED: InjectionToken<boolean> =
  new InjectionToken<boolean>('IS_LOGGING_ENABLED', {
    factory: (): boolean => isDevMode(),
    providedIn: 'root',
  });
