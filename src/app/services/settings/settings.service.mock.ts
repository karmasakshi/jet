/* eslint-disable @typescript-eslint/no-unused-vars */

import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  public get settings(): Settings {
    return DEFAULT_SETTINGS;
  }

  public storeAndUpdateSettings(_partialSettings: Partial<Settings>): void {
    // Mock implementation, do nothing
  }
}
