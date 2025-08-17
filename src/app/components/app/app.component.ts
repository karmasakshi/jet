import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  Signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { COLOR_SCHEME_OPTIONS } from '@jet/constants/color-scheme-options.constant';
import { DEFAULT_COLOR_SCHEME_OPTION } from '@jet/constants/default-color-scheme-option.constant';
import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { NAVIGATION_MENU_ITEMS } from '@jet/constants/navigation-menu-items.constant';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { AvailableColorScheme } from '@jet/types/available-color-scheme.type';
import { AvailableFontClass } from '@jet/types/available-font-class.type';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { map } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    RouterLink,
    RouterOutlet,
    TranslocoModule,
    FooterComponent,
    SidenavComponent,
    ToolbarComponent,
  ],
  selector: 'jet-app',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy, OnInit {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #document = inject(DOCUMENT);
  readonly #destroyRef = inject(DestroyRef);
  readonly #renderer2 = inject(Renderer2);
  readonly #matIconRegistry = inject(MatIconRegistry);
  readonly #domSanitizer = inject(DomSanitizer);
  readonly #meta = inject(Meta);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #serviceWorkerService = inject(ServiceWorkerService);
  readonly #settingsService = inject(SettingsService);
  readonly #translocoService = inject(TranslocoService);

  #activeColorScheme: AvailableColorScheme;
  #activeFontClass: AvailableFontClass;
  #activeFontsUrl: LanguageOption['fontsUrl'];
  #activeLanguage: AvailableLanguage;
  #activeThemeColor: ColorSchemeOption['themeColor'];
  readonly #darkColorSchemeMediaQueryList: MediaQueryList;
  readonly #isPwaMode: boolean;
  #systemColorSchemeListener:
    | ((mediaQueryListEvent: MediaQueryListEvent) => void)
    | null;

  public activeNavigationMenuItemPath: NavigationMenuItem['path'] | undefined;
  public readonly isSmallViewport: Signal<boolean>;
  public readonly languageOption: Signal<LanguageOption>;
  public readonly navigationMenuItems: NavigationMenuItem[];

  public constructor() {
    this.#activeColorScheme = DEFAULT_COLOR_SCHEME_OPTION.value;

    this.#activeFontClass = DEFAULT_LANGUAGE_OPTION.fontClass;

    this.#activeFontsUrl = DEFAULT_LANGUAGE_OPTION.fontsUrl;

    this.#activeLanguage = DEFAULT_LANGUAGE_OPTION.value;

    this.#activeThemeColor = DEFAULT_COLOR_SCHEME_OPTION.themeColor;

    this.#darkColorSchemeMediaQueryList = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    this.#isPwaMode = window.matchMedia('(display-mode: standalone)').matches;

    this.#systemColorSchemeListener = null;

    this.activeNavigationMenuItemPath = undefined;

    this.isSmallViewport = toSignal(
      this.#breakpointObserver
        .observe(Breakpoints.Web)
        .pipe(map((result) => !result.matches)),
      { initialValue: true },
    );

    this.languageOption = this.#settingsService.languageOption;

    this.navigationMenuItems = NAVIGATION_MENU_ITEMS;

    effect(
      () => {
        this.#loggerService.logEffectRun('colorSchemeOption');

        const colorScheme: AvailableColorScheme =
          this.#settingsService.colorSchemeOption().value;

        untracked(() => {
          if (colorScheme === 'automatic') {
            this.#setSystemColorSchemeListener();
          } else {
            this.#unsetSystemColorSchemeListener();
          }

          this.#setColorSchemeClass(colorScheme);
          this.#setThemeColor(colorScheme);
        });
      },
      { debugName: 'colorSchemeOption' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('languageOption');

        const languageOption: LanguageOption = this.languageOption();

        untracked(() => {
          this.#loadFont(languageOption.fontsUrl);
          this.#setFontClass(languageOption.fontClass);
          this.#setLanguage(languageOption);
        });
      },
      { debugName: 'languageOption' },
    );

    this.#loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnDestroy(): void {
    this.#unsetSystemColorSchemeListener();
  }

  public ngOnInit(): void {
    this.#analyticsService.logEvent('Start', {
      version: `v${packageJson.version}`,
    });

    this.#router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this.#progressBarService.showQueryProgressBar();
        } else if (
          event instanceof NavigationCancel ||
          event instanceof NavigationEnd ||
          event instanceof NavigationError
        ) {
          if (event instanceof NavigationEnd) {
            this.activeNavigationMenuItemPath = event.url.split('?')[0];
          }

          if (event instanceof NavigationError) {
            const error: Error | undefined = event.error as Error;
            this.#loggerService.logError(error);
            this.#alertService.showErrorAlert(error.message);
          }

          this.#progressBarService.hideProgressBar();
        }
      });

    this.#serviceWorkerService.subscribeToVersionUpdates();

    this.#setIcons();

    this.#setZoom(this.#isPwaMode);
  }

  #loadFont(nextFontsUrl: string): void {
    if (nextFontsUrl === this.#activeFontsUrl) {
      return;
    }

    this.#activeFontsUrl = nextFontsUrl;

    if (nextFontsUrl !== DEFAULT_LANGUAGE_OPTION.fontsUrl) {
      const id = 'jet-font';
      let link = document.getElementById(id);

      if (!link) {
        link = this.#renderer2.createElement('link');

        this.#renderer2.setAttribute(link, 'href', nextFontsUrl);
        this.#renderer2.setAttribute(link, 'id', id);
        this.#renderer2.setAttribute(link, 'rel', 'stylesheet');

        this.#renderer2.appendChild(this.#document.head, link);
      } else {
        this.#renderer2.setAttribute(link, 'href', nextFontsUrl);
      }
    }
  }

  #setColorSchemeClass(nextColorScheme: AvailableColorScheme): void {
    if (nextColorScheme === this.#activeColorScheme) {
      return;
    }

    this.#activeColorScheme = nextColorScheme;
    const prefix = 'jet-color-scheme-';

    this.#document.body.className = this.#document.body.classList.value
      .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
      .trim();

    if (nextColorScheme !== DEFAULT_COLOR_SCHEME_OPTION.value) {
      this.#renderer2.addClass(this.#document.body, prefix + nextColorScheme);
    }
  }

  #setFontClass(nextFontClass: AvailableFontClass): void {
    if (nextFontClass === this.#activeFontClass) {
      return;
    }

    this.#activeFontClass = nextFontClass;
    const prefix = 'jet-font-';

    this.#document.body.className = this.#document.body.classList.value
      .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
      .trim();

    if (nextFontClass !== DEFAULT_LANGUAGE_OPTION.fontClass) {
      this.#renderer2.addClass(this.#document.body, prefix + nextFontClass);
    }
  }

  #setIcons(): void {
    this.#matIconRegistry.addSvgIcon(
      'jet',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('./icons/jet.svg'),
    );

    this.#matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }

  #setLanguage(nextLanguageOption: LanguageOption): void {
    if (nextLanguageOption.value === this.#activeLanguage) {
      return;
    }

    this.#activeLanguage = nextLanguageOption.value;

    this.#renderer2.setAttribute(
      this.#document.documentElement,
      'lang',
      nextLanguageOption.value,
    );

    this.#translocoService.setActiveLang(nextLanguageOption.value);
  }

  #setSystemColorSchemeListener(): void {
    if (this.#systemColorSchemeListener) {
      return;
    }

    this.#systemColorSchemeListener = (
      mediaQueryListEvent: MediaQueryListEvent,
    ) => {
      // This updates `<meta name="theme-color" />` based on system setting.
      // This needs to run only when `this.#activeColorScheme === 'automatic'`, not otherwise.
      // The listener is set and unset accordingly, so `this.#activeColorScheme === 'automatic'` check isn't needed.
      if (mediaQueryListEvent.matches) {
        this.#setThemeColor('dark');
      } else {
        this.#setThemeColor('light');
      }
    };

    this.#darkColorSchemeMediaQueryList.addEventListener(
      'change',
      this.#systemColorSchemeListener,
    );
  }

  #setThemeColor(nextColorScheme: AvailableColorScheme): void {
    if (nextColorScheme === 'automatic') {
      nextColorScheme = this.#darkColorSchemeMediaQueryList.matches
        ? 'dark'
        : 'light';
    }

    const nextColorSchemeOption =
      COLOR_SCHEME_OPTIONS.find(
        (colorSchemeOption) => colorSchemeOption.value === nextColorScheme,
      ) ?? DEFAULT_COLOR_SCHEME_OPTION;

    if (nextColorSchemeOption.themeColor !== this.#activeThemeColor) {
      this.#activeThemeColor = nextColorSchemeOption.themeColor;

      this.#meta.updateTag({
        content: nextColorSchemeOption.themeColor ?? '#ffffff',
        name: 'theme-color',
      });
    }
  }

  #setZoom(isPwaMode: boolean): void {
    if (isPwaMode) {
      this.#meta.updateTag({
        content:
          'width=device-width, initial-scale=0.75, viewport-fit=cover, user-scalable=no',
        name: 'viewport',
      });
    }
  }

  #unsetSystemColorSchemeListener(): void {
    if (!this.#systemColorSchemeListener) {
      return;
    }

    this.#darkColorSchemeMediaQueryList.removeEventListener(
      'change',
      this.#systemColorSchemeListener,
    );

    this.#systemColorSchemeListener = null;
  }
}
