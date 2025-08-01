import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class ProgressBarService {
  readonly #loggerService = inject(LoggerService);

  readonly #defaultProgressBarConfiguration: ProgressBarConfiguration;
  readonly #progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;
  #queueTimeout: undefined | ReturnType<typeof setTimeout>;

  public constructor() {
    this.#defaultProgressBarConfiguration = {
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    };

    this.#progressBarConfiguration = signal({
      ...this.#defaultProgressBarConfiguration,
    });

    this.#queueTimeout = undefined;

    this.#loggerService.logServiceInitialization('ProgressBarService');
  }

  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    return this.#progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    this.#queueConfiguration({ isVisible: false });
  }

  public showBufferProgressBar(bufferValue: number, value: number): void {
    this.#queueConfiguration({
      bufferValue,
      isVisible: true,
      mode: 'buffer',
      value,
    });
  }

  public showIndeterminateProgressBar(): void {
    this.#queueConfiguration({ isVisible: true, mode: 'indeterminate' });
  }

  public showQueryProgressBar(): void {
    this.#queueConfiguration({ isVisible: true, mode: 'query' });
  }

  #queueConfiguration(
    partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    clearTimeout(this.#queueTimeout);

    this.#queueTimeout = setTimeout(() => {
      this.#progressBarConfiguration.set({
        ...this.#defaultProgressBarConfiguration,
        ...partialProgressBarConfiguration,
      });
    }, 100);
  }
}
