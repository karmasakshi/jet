/* eslint-disable @typescript-eslint/no-unused-vars */

import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  readonly #settings: WritableSignal<Settings>;

  public readonly colorSchemeOption: Signal<ColorSchemeOption>;
  public readonly languageOption: Signal<LanguageOption>;

  public constructor() {
    this.#settings = signal({ ...DEFAULT_SETTINGS });

    this.colorSchemeOption = computed(() => this.#settings().colorSchemeOption);

    this.languageOption = computed(() => this.#settings().languageOption);
  }

  public get settings(): Signal<Settings> {
    return this.#settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Do nothing
  }
}
