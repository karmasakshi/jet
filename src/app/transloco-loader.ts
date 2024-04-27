import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { AvailableLanguage } from '@xxx/types/available-language.type';
import { Observable } from 'rxjs';

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
    return this._httpClient.get<Translation>(
      `./assets/i18n/${availableLanguage}.json`,
    );
  }
}
