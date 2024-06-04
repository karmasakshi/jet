/* eslint-disable @typescript-eslint/no-unused-vars */

import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';
import { Observable, of } from 'rxjs';

export class SettingsServiceMock {
  public readonly settings$: Observable<Settings> = of(DEFAULT_SETTINGS);

  public get settings(): Settings {
    return DEFAULT_SETTINGS;
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Mock implementation, do nothing
  }
}
