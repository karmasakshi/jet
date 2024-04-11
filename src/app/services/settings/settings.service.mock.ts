/* eslint-disable @typescript-eslint/no-unused-vars */

import { DEFAULT_SETTINGS } from '@xxx/constants/default-settings.constant';
import { Settings } from '@xxx/interfaces/settings.interface';

export class MockSettingsService {
  public get settings(): Settings {
    return DEFAULT_SETTINGS;
  }

  // @ts-expect-error: noUnusedParameters
  public storeAndUpdateSettings(partialSettings: Partial<Settings>): void {
    // Mock implementation, do nothing
  }
}
