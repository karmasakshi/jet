import { Injectable } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { Settings } from '@jet/interfaces/settings.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public readonly settings$: Observable<Settings>;

  private readonly _settingsSubject$: BehaviorSubject<Settings>;

  public constructor(
    private readonly _loggerService: LoggerService,
    private readonly _storageService: StorageService,
  ) {
    this._settingsSubject$ = new BehaviorSubject<Settings>({
      ...DEFAULT_SETTINGS,
      ...this._storageService.getLocalStorageItem<Settings>(
        LocalStorageKey.Settings,
      ),
    });

    this.settings$ = this._settingsSubject$.asObservable();

    this._loggerService.logServiceInitialization('SettingsService');
  }

  public get settings(): Settings {
    return this._settingsSubject$.getValue();
  }

  public updateSettings(partialSettings: Partial<Settings>): void {
    const settings: Settings = {
      ...this.settings,
      ...partialSettings,
    };

    this._storageService.setLocalStorageItem(
      LocalStorageKey.Settings,
      settings,
    );

    this._settingsSubject$.next(settings);
  }
}
