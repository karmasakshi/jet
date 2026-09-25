import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { JetMatPaginatorIntl } from '@jet/classes/jet-mat-paginator-intl/jet-mat-paginator-intl';
import { TranslocoHttpLoader } from '@jet/classes/transloco-http-loader/transloco-http-loader';
import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { LANGUAGE_OPTIONS } from '@jet/constants/language-options.constant';
import { progressBarInterceptor } from '@jet/interceptors/progress-bar/progress-bar.interceptor';
import { timeoutInterceptor } from '@jet/interceptors/timeout/timeout.interceptor';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { Language } from '@jet/types/language.type';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([progressBarInterceptor, timeoutInterceptor])),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    provideBrowserGlobalErrorListeners(),
    provideEnvironmentInitializer(() => {
      inject(ServiceWorkerService).subscribeToVersionUpdates();
    }),
    { provide: MatPaginatorIntl, useClass: JetMatPaginatorIntl },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 4500, verticalPosition: 'top' },
    },
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: { disableTooltipInteractivity: true, position: 'above', showDelay: 900 },
    },
    provideClientHydration(),
    provideRouter(
      routes,
      withComponentInputBinding(),
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
        prodMode: !isDevMode(),
        reRenderOnLangChange: true,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
