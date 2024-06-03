import { InjectionToken, isDevMode } from '@angular/core';

export const IS_LOGGING_ENABLED_TOKEN: InjectionToken<boolean> =
  new InjectionToken('IS_LOGGING_ENABLED_TOKEN', {
    factory: (): boolean => isDevMode(),
    providedIn: 'root',
  });
