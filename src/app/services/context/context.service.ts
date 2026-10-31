import { BreakpointObserver } from '@angular/cdk/layout';
import {
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  Service,
  Signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { COLOR_SCHEME_OPTIONS } from '@jet/constants/color-scheme-options.constant';
import { DEFAULT_COLOR_SCHEME_OPTION } from '@jet/constants/default-color-scheme-option.constant';
import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { ColorScheme } from '@jet/types/color-scheme.type';
import { FontPair } from '@jet/types/font-pair.type';
import { TranslocoService } from '@jsverse/transloco';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Service()
export class ContextService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #destroyRef = inject(DestroyRef);
  readonly #document = inject(DOCUMENT);
  readonly #meta = inject(Meta);
  readonly #loggerService = inject(LoggerService);
  readonly #settingsService = inject(SettingsService);
  readonly #translocoService = inject(TranslocoService);

  #activeColorScheme: string;
  #activeFontPair: string;
  readonly #isPwaMode: boolean;
  readonly #colorSchemeOption: Signal<ColorSchemeOption>;
  readonly #languageOption: Signal<LanguageOption>;

  public constructor() {
    this.#activeColorScheme = DEFAULT_COLOR_SCHEME_OPTION.value;

    this.#activeFontPair = DEFAULT_LANGUAGE_OPTION.fontPair;

    this.#isPwaMode = this.#breakpointObserver.isMatched('(display-mode: standalone)');

    this.#colorSchemeOption = computed(() => this.#settingsService.settings().colorSchemeOption);

    this.#languageOption = computed(() => this.#settingsService.settings().languageOption);

    if (this.#isPwaMode) {
      this.#document.body.classList.add('pwa');
      this.#disableUserScalable();
    }

    this.#setPlatformClass();

    this.#breakpointObserver
      .observe('(prefers-color-scheme: dark)')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#setThemeColorMeta(this.#colorSchemeOption().value);
      });

    effect(
      () => {
        this.#loggerService.logEffectRun('languageOption');

        const languageOption: LanguageOption = this.#languageOption();

        untracked(() => {
          this.#setFontPairClass(languageOption.fontPair);

          this.#setLanguage(languageOption.value);
        });
      },
      { debugName: 'languageOption' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('colorSchemeOption');

        const colorSchemeOption: ColorSchemeOption = this.#colorSchemeOption();

        untracked(() => {
          this.#setColorScheme(colorSchemeOption.value);

          this.#setThemeColorMeta(colorSchemeOption.value);
        });
      },
      { debugName: 'colorSchemeOption' },
    );

    this.#loggerService.logServiceInitialization('ContextService');
  }

  #disableUserScalable(): void {
    this.#meta.updateTag({
      content: 'initial-scale=0.85, user-scalable=no, viewport-fit=cover, width=device-width',
      name: 'viewport',
    });
  }

  #setColorScheme(colorScheme: ColorScheme): void {
    if (this.#activeColorScheme === colorScheme) {
      return;
    }

    const body: HTMLElement = this.#document.body;

    if (this.#activeColorScheme !== DEFAULT_COLOR_SCHEME_OPTION.value) {
      body.classList.remove(this.#activeColorScheme);
    }

    this.#activeColorScheme = colorScheme;

    if (colorScheme !== DEFAULT_COLOR_SCHEME_OPTION.value) {
      body.classList.add(colorScheme);
    }
  }

  #setFontPairClass(fontPair: FontPair): void {
    if (this.#activeFontPair === fontPair) {
      return;
    }

    const body: HTMLElement = this.#document.body;

    if (this.#activeFontPair !== DEFAULT_LANGUAGE_OPTION.fontPair) {
      body.classList.remove(this.#activeFontPair);
    }

    this.#activeFontPair = fontPair;

    if (fontPair !== DEFAULT_LANGUAGE_OPTION.fontPair) {
      body.classList.add(fontPair);
    }
  }

  #setLanguage(language: LanguageOption['value']): void {
    this.#document.documentElement.lang = language;

    this.#translocoService.setActiveLang(language);
  }

  #setPlatformClass(): void {
    const platform = navigator.platform;

    const platformClass = (() => {
      switch (true) {
        case /mac/i.test(platform):
          return 'macos';
        case /win/i.test(platform):
          return 'windows';
        case /linux/i.test(platform):
          return 'linux';
        case /android/i.test(platform):
          return 'android';
        case /iphone|ipad|ipod/i.test(platform):
          return 'ios';
        default:
          return null;
      }
    })();

    if (platformClass) {
      this.#document.body.classList.add(platformClass);
    }
  }

  #setThemeColorMeta(colorScheme: ColorScheme): void {
    const resolvedColorScheme: ColorScheme =
      colorScheme === 'automatic'
        ? this.#breakpointObserver.isMatched('(prefers-color-scheme: dark)')
          ? 'dark'
          : 'light'
        : colorScheme;

    const colorSchemeOption: ColorSchemeOption =
      COLOR_SCHEME_OPTIONS.find(
        (colorSchemeOption) => colorSchemeOption.value === resolvedColorScheme,
      ) ?? DEFAULT_COLOR_SCHEME_OPTION;

    this.#meta.updateTag({ content: colorSchemeOption.themeColor, name: 'theme-color' });
  }
}
