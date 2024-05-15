import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly _titleSubject: Subject<string>;

  public title$: Observable<string>;

  public constructor(
    private readonly _title: Title,
    private readonly _translocoService: TranslocoService,
    private readonly _loggerService: LoggerService,
  ) {
    this._titleSubject = new Subject<string>();

    this.title$ = this._titleSubject.asObservable();

    this._loggerService.logServiceInitialization('TitleService');
  }

  public setTitle(title: string) {
    this._title.setTitle(
      this._translocoService.translate('app-name-with-title', { title }),
    );

    Promise.resolve()
      .then((): void => {
        this._titleSubject.next(title);
      })
      .catch((error: unknown): void => {
        this._loggerService.logError(error);
      });
  }
}
