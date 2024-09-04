import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly _httpClient = inject(HttpClient);
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logServiceInitialization('TranslocoHttpLoader');
  }

  public getTranslation(
    activeLanguage: AvailableLanguage,
  ): Observable<Translation> {
    return this._httpClient
      .get<Translation>(`/i18n/${activeLanguage}.json`)
      .pipe(
        catchError((): Observable<Translation> => {
          const emptyTranslation: Translation = {};
          return of(emptyTranslation);
        }),
      );
  }
}
