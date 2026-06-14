import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withInMemoryScrolling,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { JetMatPaginatorIntl } from '@jet/classes/jet-mat-paginator-intl/jet-mat-paginator-intl';
import { TranslocoHttpLoader } from '@jet/classes/transloco-http-loader/transloco-http-loader';
import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { LANGUAGE_OPTIONS } from '@jet/constants/language-options.constant';
import { progressBarInterceptor } from '@jet/interceptors/progress-bar/progress-bar.interceptor';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { Language } from '@jet/types/language.type';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([progressBarInterceptor])),
    { provide: LOCALE_ID, useValue: window.navigator.language },
    provideBrowserGlobalErrorListeners(),
    provideEnvironmentInitializer(() => {
      void inject(ServiceWorkerService);
    }),
    { provide: MatPaginatorIntl, useClass: JetMatPaginatorIntl },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000, verticalPosition: 'top' },
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: { disableTooltipInteractivity: true, showDelay: 900 },
    },
    provideRouter(
      routes,
      withComponentInputBinding(),
      ...(isDevMode() ? [withDebugTracing()] : []),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTransloco({
      config: {
        availableLangs: LANGUAGE_OPTIONS.map(
          (languageOption: LanguageOption): Language => languageOption.value,
        ),
        defaultLang: DEFAULT_LANGUAGE_OPTION.value,
        failedRetries: 1,
        prodMode: !isDevMode(),
        reRenderOnLangChange: true,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
