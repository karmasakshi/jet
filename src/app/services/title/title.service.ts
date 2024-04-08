import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoggerService } from '../logger/logger.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly _appName: string;
  private readonly _titleSubject: BehaviorSubject<string>;

  public title$: Observable<string>;

  public constructor(
    private readonly _title: Title,
    private readonly _loggerService: LoggerService,
  ) {
    this._appName = 'xxx';

    this._titleSubject = new BehaviorSubject<string>(this._appName);

    this.title$ = this._titleSubject.asObservable();

    this._loggerService.logServiceInitialization('TitleService');
  }

  public setTitle(title: string) {
    this._title.setTitle(`${title} - ${this._appName}`);

    this._titleSubject.next(title);
  }
}
