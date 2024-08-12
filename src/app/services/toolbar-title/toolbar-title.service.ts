import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarTitleService {
  private readonly _toolbarTitle: WritableSignal<string>;

  public constructor(private readonly _loggerService: LoggerService) {
    this._toolbarTitle = signal('');

    this._loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public get toolbarTitle(): Signal<string> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(toolbarTitle: string) {
    this._toolbarTitle.set(toolbarTitle);
  }
}
