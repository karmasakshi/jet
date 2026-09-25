/* eslint-disable @typescript-eslint/no-unused-vars */

import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  readonly #settings: WritableSignal<Settings>;

  public readonly directionality: Signal<Settings['languageOption']['directionality']>;
  public readonly settings: Signal<Settings>;

  public constructor() {
    this.#settings = signal(DEFAULT_SETTINGS);

    this.directionality = computed(() => this.#settings().languageOption.directionality);

    this.settings = this.#settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Do nothing
  }
}
