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
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly #loggerService = inject(LoggerService);
  readonly #storageService = inject(StorageService);

  readonly #settings: WritableSignal<Settings>;

  public readonly colorSchemeOption: Signal<ColorSchemeOption>;
  public readonly languageOption: Signal<LanguageOption>;

  public constructor() {
    const storedSettings: null | Settings =
      this.#storageService.getLocalStorageItem<Settings>(
        LocalStorageKey.Settings,
      );

    this.#settings = signal({ ...DEFAULT_SETTINGS, ...storedSettings });

    this.colorSchemeOption = computed(() => this.#settings().colorSchemeOption);

    this.languageOption = computed(() => this.#settings().languageOption);

    effect(
      () => {
        this.#loggerService.logEffectRun('#settings');

        const settings: Settings = this.#settings();

        untracked(() =>
          this.#storageService.setLocalStorageItem(
            LocalStorageKey.Settings,
            settings,
          ),
        );
      },
      { debugName: '#settings' },
    );

    this.#loggerService.logServiceInitialization('SettingsService');
  }

  public get settings(): Signal<Settings> {
    return this.#settings.asReadonly();
  }

  public updateSettings(partialSettings: Partial<Settings>): void {
    this.#settings.update((settings) => ({ ...settings, ...partialSettings }));
  }
}
