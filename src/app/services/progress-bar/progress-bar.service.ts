import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class ProgressBarService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _defaultProgressBarConfiguration: ProgressBarConfiguration;
  private readonly _progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;
  private _queueTimeout: null | ReturnType<typeof setTimeout>;

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

    this._queueTimeout = null;

    this._loggerService.logServiceInitialization('ProgressBarService');
  }

  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    return this._progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    this._queue({ isVisible: false });
  }

  public showProgressBar(
    partialProgressBarConfiguration?: Partial<ProgressBarConfiguration>,
  ): void {
    this._queue({ ...partialProgressBarConfiguration, isVisible: true });
  }

  private _queue(
    partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    if (this._queueTimeout) {
      clearTimeout(this._queueTimeout);
    }

    this._queueTimeout = setTimeout(() => {
      this._progressBarConfiguration.set({
        ...this._defaultProgressBarConfiguration,
        ...partialProgressBarConfiguration,
      });

      this._queueTimeout = null;
    }, 100);
  }
}
