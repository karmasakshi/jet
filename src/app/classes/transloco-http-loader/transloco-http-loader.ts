import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { Language } from '@jet/types/language.type';
import { Translation, TranslocoLoader, TranslocoLoaderData } from '@jsverse/transloco';
import { Observable, tap } from 'rxjs';

@Service({ autoProvided: false })
export class TranslocoHttpLoader implements TranslocoLoader {
  readonly #httpClient = inject(HttpClient);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logClassInitialization('TranslocoHttpLoader');
  }

  public getTranslation(
    language: Language,
    translocoLoaderData?: TranslocoLoaderData,
  ): Observable<Translation> | Promise<Translation> {
    const scope: string | undefined = translocoLoaderData?.scope;
    const path: string = scope ? `/i18n/${scope}/${language}.json` : `/i18n/${language}.json`;

    return this.#httpClient.get<Translation>(path).pipe(
      tap({
        error: (exception: unknown) => {
          this.#loggerService.logException(exception);
          this.#alertService.showExceptionAlert(exception);
        },
      }),
    );
  }
}
