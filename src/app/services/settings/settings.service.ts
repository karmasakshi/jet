import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { DEFAULT_LANGUAGE } from '@xxx/constants/default-language.constant';
import { STORAGE_KEYS } from '@xxx/constants/storage-keys.constant';
import { Settings } from '@xxx/interfaces/settings.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public settings$: Observable<Settings>;

  private readonly _defaultSettings: Settings;
  private readonly _settingsSubject: BehaviorSubject<Settings>;

  public constructor(
    private readonly _translocoService: TranslocoService,
    private readonly _loggerService: LoggerService,
    private readonly _storageService: StorageService,
  ) {
    this._defaultSettings = {
      language: DEFAULT_LANGUAGE,
    };

    this._settingsSubject = new BehaviorSubject<Settings>(
      this._storageService.getLocalStorageItem<Settings>(
        STORAGE_KEYS.SETTINGS,
      ) ?? this._defaultSettings,
    );

    this._translocoService.setActiveLang(this.settings.language.value);

    this.settings$ = this._settingsSubject.asObservable();

    this._loggerService.logServiceInitialization('SettingsService');
  }

  public get settings(): Settings {
    return this._settingsSubject.getValue();
  }

  public storeAndUpdateSettings(partialSettings: Partial<Settings>): void {
    const settings: Settings = {
      ...this.settings,
      ...partialSettings,
    };

    this._storageService.setLocalStorageItem(STORAGE_KEYS.SETTINGS, settings);

    this._settingsSubject.next(settings);
  }
}
