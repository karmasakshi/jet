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

  readonly #toolbarTitle: WritableSignal<string | undefined>;

  public constructor() {
    this.#toolbarTitle = signal(undefined);

    this.#loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public get toolbarTitle(): Signal<string | undefined> {
    return this.#toolbarTitle.asReadonly();
  }

  public setToolbarTitle(toolbarTitle: string): void {
    this.#toolbarTitle.set(toolbarTitle);
  }
}
