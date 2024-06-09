import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  public constructor(
    private readonly _httpClient: HttpClient,
    private readonly _loggerService: LoggerService,
  ) {
    this._loggerService.logServiceInitialization('TranslocoHttpLoader');
  }

  public getTranslation(
    availableLanguage: AvailableLanguage,
  ): Observable<Translation> {
    return this._httpClient
      .get<Translation>(`./i18n/${availableLanguage}.json`)
      .pipe(
        catchError(() => {
          const emptyTranslation: Translation = {};
          return of(emptyTranslation);
        }),
      );
  }
}
