/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { DEFAULT_SETTINGS } from '@jet/constants/default-settings.constant';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { ThemeOption } from '@jet/interfaces/theme-option.interface';

export class SettingsServiceMock {
  private readonly _settings: WritableSignal<Settings>;

  public readonly languageOption: Signal<LanguageOption>;
  public readonly themeOption: Signal<ThemeOption>;

  public constructor() {
    this._settings = signal({
      ...DEFAULT_SETTINGS,
    });

    this.languageOption = computed(() => this._settings().languageOption);

    this.themeOption = computed(() => this._settings().themeOption);
  }

  public get settings(): Signal<Settings> {
    return this._settings.asReadonly();
  }

  public updateSettings(_partialSettings: Partial<Settings>): void {
    // Do nothing
  }
}
