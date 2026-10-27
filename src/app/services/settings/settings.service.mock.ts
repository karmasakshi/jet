/* eslint-disable @typescript-eslint/no-unused-vars */

import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { Settings } from '@jet/interfaces/settings.interface';
import { Direction } from '@jet/types/direction.type';

export class SettingsServiceMock {
  readonly #settings: WritableSignal<Settings>;

  public readonly direction: Signal<Direction>;
  public readonly settings: Signal<Settings>;

  public constructor() {
    this.#settings = signal(DEFAULT_SETTINGS);

    this.direction = computed(() => this.#settings().languageOption.direction);

    this.settings = this.#settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Do nothing
  }
}
