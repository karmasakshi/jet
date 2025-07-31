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
  private readonly _loggerService = inject(LoggerService);

  private readonly _defaultProgressBarConfiguration: ProgressBarConfiguration;
  private readonly _progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;
  private _queueTimeout: undefined | ReturnType<typeof setTimeout>;

  public constructor() {
    this._defaultProgressBarConfiguration = {
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    };

    this._progressBarConfiguration = signal({
      ...this._defaultProgressBarConfiguration,
    });

    this._queueTimeout = undefined;

    this._loggerService.logServiceInitialization('ProgressBarService');
  }

  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    return this._progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    this._queueConfiguration({ isVisible: false });
  }

  public showBufferProgressBar(bufferValue: number, value: number): void {
    this._queueConfiguration({
      bufferValue,
      isVisible: true,
      mode: 'buffer',
      value,
    });
  }

  public showIndeterminateProgressBar(): void {
    this._queueConfiguration({ isVisible: true, mode: 'indeterminate' });
  }

  public showQueryProgressBar(): void {
    this._queueConfiguration({ isVisible: true, mode: 'query' });
  }

  private _queueConfiguration(
    partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    clearTimeout(this._queueTimeout);
    this._queueTimeout = setTimeout(() => {
      this._progressBarConfiguration.set({
        ...this._defaultProgressBarConfiguration,
        ...partialProgressBarConfiguration,
      });
    }, 100);
  }
}
