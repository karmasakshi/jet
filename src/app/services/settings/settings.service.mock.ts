/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  public get settings(): Signal<Settings> {
    const settings: WritableSignal<Settings> = signal(DEFAULT_SETTINGS);

    return settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Mock implementation, do nothing
  }
}
