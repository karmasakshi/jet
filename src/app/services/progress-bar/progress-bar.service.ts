import { DestroyRef, inject, Service, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { debounceTime, Subject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Service()
export class ProgressBarService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #loggerService = inject(LoggerService);

  readonly #configurationQueue = new Subject<Partial<ProgressBarConfiguration>>();
  readonly #progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;

  public readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;

  public constructor() {
    this.#progressBarConfiguration = signal({
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    });

    this.progressBarConfiguration = this.#progressBarConfiguration.asReadonly();

    this.#configurationQueue
      .pipe(debounceTime(90), takeUntilDestroyed(this.#destroyRef))
      .subscribe((partialProgressBarConfiguration) => {
        this.#progressBarConfiguration.update((progressBarConfiguration) => ({
          ...progressBarConfiguration,
          ...partialProgressBarConfiguration,
        }));
      });

    this.#loggerService.logServiceInitialization('ProgressBarService');
  }

  public hideProgressBar(): void {
    this.#queueConfiguration({ isVisible: false });
  }

  public showBufferProgressBar(bufferValue: number, value: number): void {
    this.#queueConfiguration({ bufferValue, isVisible: true, mode: 'buffer', value });
  }

  public showIndeterminateProgressBar(): void {
    this.#queueConfiguration({ isVisible: true, mode: 'indeterminate' });
  }

  public showQueryProgressBar(): void {
    this.#queueConfiguration({ isVisible: true, mode: 'query' });
  }

  #queueConfiguration(partialProgressBarConfiguration: Partial<ProgressBarConfiguration>): void {
    this.#configurationQueue.next(partialProgressBarConfiguration);
  }
}
