import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly _httpClient = inject(HttpClient);
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logServiceInitialization('TranslocoHttpLoader');
  }

  public getTranslation(language: AvailableLanguage): Observable<Translation> {
    return this._httpClient.get<Translation>(`/i18n/${language}.json`).pipe(
      catchError((error: Error): Observable<Translation> => {
        this._loggerService.logError(error);
        const emptyTranslation: Translation = {};
        return of(emptyTranslation);
      }),
    );
  }
}
