import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class ToolbarTitleService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _toolbarTitle: WritableSignal<null | string>;

  public constructor() {
    this._toolbarTitle = signal(null);

    this._loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public get toolbarTitle(): Signal<null | string> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(toolbarTitle: string): void {
    this._toolbarTitle.set(toolbarTitle);
  }
}
