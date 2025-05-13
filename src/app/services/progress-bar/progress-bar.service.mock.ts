/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';

export class ProgressBarServiceMock {
  private readonly _defaultProgressBarConfiguration: ProgressBarConfiguration;
  private readonly _progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;

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
  }

  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    return this._progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    // Do nothing
  }

  public showProgressBar(
    _partialProgressBarConfiguration?: Partial<ProgressBarConfiguration>,
  ): void {
    // Do nothing
  }
}
