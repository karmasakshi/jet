import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  public readonly title$: Observable<string>;

  private readonly _titleSubject: Subject<string>;

  public constructor(
    private readonly _title: Title,
    private readonly _loggerService: LoggerService,
  ) {
    this._titleSubject = new Subject<string>();

    this.title$ = this._titleSubject.asObservable();

    this._loggerService.logServiceInitialization('TitleService');
  }

  public setTitle(title: string) {
    this._title.setTitle(title);

    Promise.resolve()
      .then((): void => {
        this._titleSubject.next(title);
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
      });
  }
}
