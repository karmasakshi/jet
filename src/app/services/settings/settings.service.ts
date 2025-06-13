import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option';
import { LanguageOption } from '@jet/interfaces/language-option';
import { Settings } from '@jet/interfaces/settings';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _loggerService = inject(LoggerService);
  private readonly _storageService = inject(StorageService);

  private readonly _settings: WritableSignal<Settings>;

  public readonly colorSchemeOption: Signal<ColorSchemeOption>;
  public readonly languageOption: Signal<LanguageOption>;

  public constructor() {
    const storedSettings: null | Settings =
      this._storageService.getLocalStorageItem<Settings>(
        LocalStorageKey.Settings,
      );

    this._settings = signal({ ...DEFAULT_SETTINGS, ...storedSettings });

    this.colorSchemeOption = computed(() => this._settings().colorSchemeOption);

    this.languageOption = computed(() => this._settings().languageOption);

    effect(() => {
      this._loggerService.logEffectRun('_settings');

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
    this._settings.update((settings) => ({ ...settings, ...partialSettings }));
  }
}
