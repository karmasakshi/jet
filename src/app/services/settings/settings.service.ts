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
import { Settings } from '@jet/interfaces/settings.interface';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly #loggerService = inject(LoggerService);
  readonly #storageService = inject(StorageService);

  readonly #settings: WritableSignal<Settings>;

  public readonly directionality: Signal<
    Settings['languageOption']['directionality']
  >;

  public constructor() {
    const storedSettings: null | Settings =
      this.#storageService.getLocalStorageItem<Settings>(
        LocalStorageKey.Settings,
      );

    this.#settings = signal({ ...DEFAULT_SETTINGS, ...storedSettings });

    this.directionality = computed(
      () => this.#settings().languageOption.directionality,
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('settings');

        const settings: Settings = this.#settings();

        untracked(() =>
          this.#storageService.setLocalStorageItem(
            LocalStorageKey.Settings,
            settings,
          ),
        );
      },
      { debugName: 'settings' },
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
