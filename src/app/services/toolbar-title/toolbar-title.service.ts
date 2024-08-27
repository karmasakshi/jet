import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarTitleService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _toolbarTitle: WritableSignal<string>;

  public constructor() {
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
