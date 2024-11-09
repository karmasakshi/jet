import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { ThemeOption } from '@jet/interfaces/theme-option.interface';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _loggerService = inject(LoggerService);
  private readonly _storageService = inject(StorageService);

  private readonly _settings: WritableSignal<Settings>;

  public readonly languageOption: Signal<LanguageOption>;
  public readonly themeOption: Signal<ThemeOption>;

  public constructor() {
    const storedSettings = this._storageService.getLocalStorageItem<Settings>(
      LocalStorageKey.Settings,
    );

    this._settings = signal({
      ...DEFAULT_SETTINGS,
      ...storedSettings,
    });

    this.languageOption = computed(() => this._settings().languageOption);

    this.themeOption = computed(() => this._settings().themeOption);

    effect(() => {
      const settings: Settings = this._settings();
      untracked(() =>
        this._storageService.setLocalStorageItem(
          LocalStorageKey.Settings,
          settings,
        ),
      );
    });

    this._loggerService.logServiceInitialization('SettingsService');
  }

  public get settings(): Signal<Settings> {
    return this._settings.asReadonly();
  }

  public updateSettings(partialSettings: Partial<Settings>): void {
    this._settings.update((settings) => ({
      ...settings,
      ...partialSettings,
    }));
  }
}
