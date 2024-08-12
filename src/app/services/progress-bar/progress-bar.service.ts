import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  private readonly _defaultProgressBarConfiguration: ProgressBarConfiguration;
  private readonly _progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;

  public constructor(private readonly _loggerService: LoggerService) {
    this._defaultProgressBarConfiguration = {
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    };

    this._progressBarConfiguration = signal(
      this._defaultProgressBarConfiguration,
    );

    this._loggerService.logServiceInitialization('ProgressBarService');
  }

  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    return this._progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    this._progressBarConfiguration.set({
      ...this._defaultProgressBarConfiguration,
      isVisible: false,
    });
  }

  public showProgressBar(
    partialProgressBarConfiguration?: Partial<ProgressBarConfiguration>,
  ): void {
    this._progressBarConfiguration.set({
      ...this._defaultProgressBarConfiguration,
      ...partialProgressBarConfiguration,
      isVisible: true,
    });
  }

  public updateProgressBar(
    partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    this._progressBarConfiguration.set({
      ...this._progressBarConfiguration(),
      ...partialProgressBarConfiguration,
    });
  }
}
