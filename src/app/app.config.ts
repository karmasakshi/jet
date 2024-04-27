import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTransloco } from '@jsverse/transloco';
import { DEFAULT_LANGUAGE_OPTION } from '@xxx/constants/default-language-option.constant';
import { LANGUAGE_OPTIONS } from '@xxx/constants/language-options.constant';
import { LanguageOption } from '@xxx/interfaces/language-option.interface';
import { AvailableLanguage } from '@xxx/types/available-language.type';
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
        availableLangs: LANGUAGE_OPTIONS.map(
          (languageOption: LanguageOption): AvailableLanguage =>
            languageOption.value,
        ),
        defaultLang: DEFAULT_LANGUAGE_OPTION.value,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
