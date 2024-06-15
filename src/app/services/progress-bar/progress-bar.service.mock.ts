/* eslint-disable @typescript-eslint/no-unused-vars */

import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { Observable, of } from 'rxjs';

export class ProgressBarServiceMock {
  public readonly progressBarConfiguration$: Observable<ProgressBarConfiguration> =
    of({
      bufferValue: 0,
      isVisible: false,
      mode: 'indeterminate',
      value: 0,
    });

  public hideProgressBar(): void {
    // Mock implementation, do nothing
  }

  public showProgressBar(
    _partialProgressBarConfiguration: Partial<ProgressBarConfiguration>,
  ): void {
    // Mock implementation, do nothing
  }
}
