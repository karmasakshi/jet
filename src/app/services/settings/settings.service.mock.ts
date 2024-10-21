/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  private readonly _settings: WritableSignal<Settings>;

  public constructor() {
    this._settings = signal({
      ...DEFAULT_SETTINGS,
    });
  }

  public get settings(): Signal<Settings> {
    return this._settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Mock implementation, do nothing
  }
}
