/* eslint-disable @typescript-eslint/no-unused-vars */

import { signal, Signal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';

export class AlertServiceMock {
  private readonly _settings: Signal<Settings>;

  public constructor() {
    this._settings = signal(DEFAULT_SETTINGS);
  }

  public showAlert(
    _message: string,
    _cta?: string,
    _action?: () => void,
  ): void {
    // Mock implementation, do nothing
  }

  public showErrorAlert(_message = ''): void {
    // Mock implementation, do nothing
  }
}
