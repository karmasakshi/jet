import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { Language } from '@jet/types/language.type';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  readonly #httpClient = inject(HttpClient);
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logClassInitialization('TranslocoHttpLoader');
  }

  public getTranslation(language: Language): Observable<Translation> {
    return this.#httpClient.get<Translation>(`/i18n/${language}.json`).pipe(
      catchError((error: Error): Observable<Translation> => {
        this.#loggerService.logError(error);
        const emptyTranslation: Translation = {};
        return of(emptyTranslation);
      }),
    );
  }
}
