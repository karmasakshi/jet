import { inject, Service, signal, Signal, WritableSignal } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { LoggerService } from '../logger/logger.service';

@Service()
export class ToolbarTitleService {
  readonly #loggerService = inject(LoggerService);

  readonly #toolbarTitle: WritableSignal<string>;

  public readonly toolbarTitle: Signal<string>;

  public constructor() {
    this.#toolbarTitle = signal(translate('constants.loading'));

    this.toolbarTitle = this.#toolbarTitle.asReadonly();

    this.#loggerService.logServiceInitialization('ToolbarTitleService');
  }

  public setToolbarTitle(toolbarTitle: string): void {
    this.#toolbarTitle.set(toolbarTitle);
  }
}
