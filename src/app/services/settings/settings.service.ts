import { Injectable } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { STORAGE_KEYS } from '@jet/constants/storage-keys.constant';
import { Settings } from '@jet/interfaces/settings.interface';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settingsSubject: BehaviorSubject<Settings>;

  public settings$: Observable<Settings>;

  public constructor(
    private readonly _translocoService: TranslocoService,
    private readonly _loggerService: LoggerService,
    private readonly _storageService: StorageService,
  ) {
    this._settingsSubject = new BehaviorSubject<Settings>({
      ...DEFAULT_SETTINGS,
      ...this._storageService.getLocalStorageItem<Settings>(
        STORAGE_KEYS.SETTINGS,
      ),
    });

    this._translocoService.setActiveLang(this.settings.languageOption.value);

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

    Promise.resolve()
      .then((): void => {
        this._settingsSubject.next(settings);
      })
      .catch((error: unknown): void => {
        this._loggerService.logError(error);
      });
  }
}
