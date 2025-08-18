/* eslint-disable @typescript-eslint/no-unused-vars */

import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  readonly #settings: WritableSignal<Settings>;

  public readonly directionality: Signal<LanguageOption['directionality']>;

  public constructor() {
    this.#settings = signal({ ...DEFAULT_SETTINGS });

    this.directionality = computed(
      () => this.#settings().languageOption.directionality,
    );
  }

  public get settings(): Signal<Settings> {
    return this.#settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Do nothing
  }
}
