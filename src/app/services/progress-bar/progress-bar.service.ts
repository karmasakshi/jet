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

  readonly #progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;
  #queueTimeoutId: number | undefined;

  public constructor() {
    this.#progressBarConfiguration = signal({
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    });

    this.#queueTimeoutId = undefined;

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
    clearTimeout(this.#queueTimeoutId);

    this.#queueTimeoutId = setTimeout(() => {
      this.#progressBarConfiguration.update((progressBarConfiguration) => ({
        ...progressBarConfiguration,
        ...partialProgressBarConfiguration,
      }));
    }, 90);
  }
}
