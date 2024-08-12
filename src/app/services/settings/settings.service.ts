import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { Settings } from '@jet/interfaces/settings.interface';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settings: WritableSignal<Settings>;

  public constructor(
    private readonly _loggerService: LoggerService,
    private readonly _storageService: StorageService,
  ) {
    this._settings = signal({
      ...DEFAULT_SETTINGS,
      ...this._storageService.getLocalStorageItem<Settings>(
        LocalStorageKey.Settings,
      ),
    });

    this._loggerService.logServiceInitialization('SettingsService');
  }

  public get settings(): Signal<Settings> {
    return this._settings.asReadonly();
  }

  public updateSettings(partialSettings: Partial<Settings>): void {
    const settings: Settings = {
      ...this.settings(),
      ...partialSettings,
    };

    this._storageService.setLocalStorageItem(
      LocalStorageKey.Settings,
      settings,
    );

    this._settings.set(settings);
  }
}
