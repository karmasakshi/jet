import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
import { provideMaterialSymbols } from '@jet/providers/material-symbols.provider';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { alternateEmailFillIcon } from '@jet/svgs/alternate_email-fill';
import { closeFillIcon } from '@jet/svgs/close-fill';
import { contrastFillIcon } from '@jet/svgs/contrast-fill';
import { darkModeFillIcon } from '@jet/svgs/dark_mode-fill';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { languageFillIcon } from '@jet/svgs/language-fill';
import { lightModeFillIcon } from '@jet/svgs/light_mode-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { refreshFillIcon } from '@jet/svgs/refresh-fill';
import { shortTextFillIcon } from '@jet/svgs/short_text-fill';
import { translateFillIcon } from '@jet/svgs/translate-fill';
import { visibilityFillIcon } from '@jet/svgs/visibility-fill';
import { visibilityOffFillIcon } from '@jet/svgs/visibility_off-fill';
import { Language } from '@jet/types/language.type';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoPersistTranslations } from '@jsverse/transloco-persist-translations';
import { routes } from './app.routes';
import { autorenewFillIcon } from './svgs/autorenew-fill';
import { imagesearchRollerFillIcon } from './svgs/imagesearch_roller-fill';
import { resetSettingsFillIcon } from './svgs/reset_settings-fill';
import { tuneFillIcon } from './svgs/tune-fill';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([progressBarInterceptor])),
    { provide: LOCALE_ID, useValue: window.navigator.language },
    provideBrowserGlobalErrorListeners(),
    provideMaterialSymbols([
      alternateEmailFillIcon,
      autorenewFillIcon,
      closeFillIcon,
      contrastFillIcon,
      darkModeFillIcon,
      homeFillIcon,
      imagesearchRollerFillIcon,
      languageFillIcon,
      lightModeFillIcon,
      personFillIcon,
      refreshFillIcon,
      resetSettingsFillIcon,
      shortTextFillIcon,
      translateFillIcon,
      tuneFillIcon,
      visibilityFillIcon,
      visibilityOffFillIcon,
    ]),
    provideEnvironmentInitializer(() => {
      void inject(ServiceWorkerService);
    }),
    { provide: MatPaginatorIntl, useClass: JetMatPaginatorIntl },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 4500, verticalPosition: 'top' },
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
    }),
    provideTranslocoPersistTranslations({
      loader: TranslocoHttpLoader,
      storage: { useValue: localStorage },
      ttl: 86400,
    }),
  ],
};
