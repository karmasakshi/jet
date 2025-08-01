/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';

export class ProgressBarServiceMock {
  readonly #defaultProgressBarConfiguration: ProgressBarConfiguration;
  readonly #progressBarConfiguration: WritableSignal<ProgressBarConfiguration>;

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
  }

  public get progressBarConfiguration(): Signal<ProgressBarConfiguration> {
    return this.#progressBarConfiguration.asReadonly();
  }

  public hideProgressBar(): void {
    // Do nothing
  }

  public showBufferProgressBar(_bufferValue: number, _value: number): void {
    // Do nothing
  }

  public showIndeterminateProgressBar(): void {
    // Do nothing
  }

  public showQueryProgressBar(): void {
    // Do nothing
  }
}
