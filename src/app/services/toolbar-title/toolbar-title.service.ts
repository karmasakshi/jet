import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarTitleService {
  public readonly toolbarTitle$: Observable<string>;

  private readonly _toolbarTitleSubject: Subject<string>;

  public constructor(private readonly _loggerService: LoggerService) {
    this._toolbarTitleSubject = new Subject<string>();

    this.toolbarTitle$ = this._toolbarTitleSubject.asObservable();

    this._loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public setToolbarTitle(toolbarTitle: string) {
    Promise.resolve()
      .then((): void => {
        this._toolbarTitleSubject.next(toolbarTitle);
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
      });
  }
}
