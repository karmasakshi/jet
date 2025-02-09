/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';

export class SettingsServiceMock {
  private readonly _settings: WritableSignal<Settings>;

  public readonly colorSchemeOption: Signal<ColorSchemeOption>;
  public readonly languageOption: Signal<LanguageOption>;

  public constructor() {
    this._settings = signal({ ...DEFAULT_SETTINGS });

    this.colorSchemeOption = computed(() => this._settings().colorSchemeOption);

    this.languageOption = computed(() => this._settings().languageOption);
  }

  public get settings(): Signal<Settings> {
    return this._settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Do nothing
  }
}
