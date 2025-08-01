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
  readonly #loggerService = inject(LoggerService);

  readonly #toolbarTitle: WritableSignal<null | string>;

  public constructor() {
    this.#toolbarTitle = signal(null);

    this.#loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public get toolbarTitle(): Signal<null | string> {
    return this.#toolbarTitle.asReadonly();
  }

  public setToolbarTitle(toolbarTitle: string): void {
    this.#toolbarTitle.set(toolbarTitle);
  }
}
