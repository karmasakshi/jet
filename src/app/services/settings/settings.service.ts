import { computed, effect, inject, Service, signal, Signal, WritableSignal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { Settings } from '@jet/interfaces/settings.interface';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';

@Service()
export class SettingsService {
  readonly #loggerService = inject(LoggerService);
  readonly #storageService = inject(StorageService);

  readonly #settings: WritableSignal<Settings>;

  public readonly directionality: Signal<Settings['languageOption']['directionality']>;
  public readonly settings: Signal<Settings>;

  public constructor() {
    this.#settings = signal({
      ...DEFAULT_SETTINGS,
      ...this.#storageService.getLocalStorageItem<Settings>(LocalStorageKey.Settings),
    });

    this.directionality = computed(() => this.#settings().languageOption.directionality);

    this.settings = this.#settings.asReadonly();

    effect(
      () => {
        this.#loggerService.logEffectRun('settings');

        const settings = this.#settings();

        this.#storageService.setLocalStorageItem(LocalStorageKey.Settings, settings);
      },
      { debugName: 'settings' },
    );

    this.#loggerService.logServiceInitialization('SettingsService');
  }

  public updateSettings(partialSettings: Partial<Settings>): void {
    this.#settings.update((settings) => ({ ...settings, ...partialSettings }));
  }
}
