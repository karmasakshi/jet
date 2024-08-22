/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';

export class ProgressBarServiceMock {
  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    const progressBarConfiguration: WritableSignal<ProgressBarConfiguration> =
      signal({
        bufferValue: 0,
        isVisible: false,
        mode: 'indeterminate',
        value: 0,
      });

    return progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    // Mock implementation, do nothing
  }

  public showProgressBar(
    _partialProgressBarConfiguration?: Partial<ProgressBarConfiguration>,
  ): void {
    // Mock implementation, do nothing
  }

  public updateProgressBarConfiguration(
    _partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    // Mock implementation, do nothing
  }
}
