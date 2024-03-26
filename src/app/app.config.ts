import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTransloco } from '@jsverse/transloco';
import { DEFAULT_LANGUAGE } from '@xxx/constants/default-language.constant';
import { LANGUAGES } from '@xxx/constants/languages.constant';
import { Language } from '@xxx/interfaces/language.interface';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

export const applicationConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTransloco({
      config: {
        availableLangs: LANGUAGES.map(
          (language: Language): string => language.value,
        ),
        defaultLang: DEFAULT_LANGUAGE.value,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
