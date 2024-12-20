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

  private readonly _toolbarTitle: WritableSignal<string | undefined>;

  public constructor() {
    this._toolbarTitle = signal(undefined);

    this._loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public get toolbarTitle(): Signal<string | undefined> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(toolbarTitle: string): void {
    this._toolbarTitle.set(toolbarTitle);
  }
}
