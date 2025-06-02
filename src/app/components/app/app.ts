import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  Signal,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { Analytics } from '@jet/directives/analytics/analytics';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { UserService } from '@jet/services/user/user.service';
import { AvailableColorScheme } from '@jet/types/available-color-scheme.type';
import { AvailableFontClass } from '@jet/types/available-font-class.type';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';
import packageJson from 'package.json';
import { Subscription } from 'rxjs';
import { Footer } from '../footer/footer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterLink,
    RouterOutlet,
    Analytics,
    TranslocoModule,
    Footer,
  ],
  selector: 'jet-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _document = inject(DOCUMENT);
  private readonly _renderer2 = inject(Renderer2);
  private readonly _matIconRegistry = inject(MatIconRegistry);
  private readonly _domSanitizer = inject(DomSanitizer);
  private readonly _meta = inject(Meta);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _serviceWorkerService = inject(ServiceWorkerService);
  private readonly _settingsService = inject(SettingsService);
  private readonly _toolbarTitleService = inject(ToolbarTitleService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private _activeFontClass: AvailableFontClass;
  private _activeLanguage: AvailableLanguage;
  private _activeColorScheme: AvailableColorScheme;
  private _activeThemeColor: ColorSchemeOption['themeColor'];
  private readonly _darkColorSchemeMediaQuery: MediaQueryList;
  private _systemColorSchemeListener:
    | null
    | ((mediaQueryListEvent: MediaQueryListEvent) => void);
  private readonly _isPwaMode: boolean;
  private _routerSubscription: Subscription;
  private _serviceWorkerUpdateSubscription: Subscription;

  public activeNavigationMenuItemPath: undefined | NavigationMenuItem['path'];
  public readonly isSmallViewport: boolean;
  public readonly languageOption: Signal<LanguageOption>;
  public readonly navigationMenuItems: NavigationMenuItem[];
  public readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  public readonly toolbarTitle: Signal<null | string>;
  public readonly user: Signal<null | User>;

  public constructor() {
    this._activeFontClass = DEFAULT_LANGUAGE_OPTION.fontClass;

    this._activeLanguage = DEFAULT_LANGUAGE_OPTION.value;

    this._activeColorScheme = DEFAULT_COLOR_SCHEME_OPTION.value;

    this._activeThemeColor = DEFAULT_COLOR_SCHEME_OPTION.themeColor;

    this._darkColorSchemeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    this._systemColorSchemeListener = null;

    this._isPwaMode = window.matchMedia('(display-mode: standalone)').matches;

    this._routerSubscription = Subscription.EMPTY;

    this._serviceWorkerUpdateSubscription = Subscription.EMPTY;

    this.activeNavigationMenuItemPath = undefined;

    this.isSmallViewport = this._breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]);

    this.languageOption = this._settingsService.languageOption;

    this.navigationMenuItems = NAVIGATION_MENU_ITEMS;

    this.progressBarConfiguration =
      this._progressBarService.progressBarConfiguration;

    this.toolbarTitle = this._toolbarTitleService.toolbarTitle;

    this.user = this._userService.user;

    effect(() => {
      this._loggerService.logEffectRun('languageOption');

      const languageOption: LanguageOption = this.languageOption();

      untracked(() => {
        this._setFontClass(languageOption.fontClass);
        this._setLanguage(languageOption);
      });
    });

    effect(() => {
      this._loggerService.logEffectRun('colorSchemeOption');

      const colorScheme: AvailableColorScheme =
        this._settingsService.colorSchemeOption().value;

      untracked(() => {
        if (colorScheme === 'automatic') {
          this._setSystemColorSchemeListener();
        } else {
          this._unsetSystemColorSchemeListener();
        }

        this._setColorSchemeClass(colorScheme);
        this._setThemeColor(colorScheme);
      });
    });

    this._loggerService.logComponentInitialization('App');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Start', {
      version: `v${packageJson.version}`,
    });

    this._routerSubscription = this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this._progressBarService.showProgressBar({ mode: 'query' });
      } else if (
        event instanceof NavigationCancel ||
        event instanceof NavigationEnd ||
        event instanceof NavigationError
      ) {
        if (event instanceof NavigationEnd) {
          this.activeNavigationMenuItemPath = event.url.split('?')[0];
        }

        if (event instanceof NavigationError) {
          const error: undefined | Error = event.error as Error;
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
        }

        this._progressBarService.hideProgressBar();
      }
    });

    this._serviceWorkerUpdateSubscription =
      this._serviceWorkerService.serviceWorkerUpdateSubscription;

    this._setIcons();
    this._setZoom(this._isPwaMode);
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._serviceWorkerUpdateSubscription.unsubscribe();
    this._unsetSystemColorSchemeListener();
  }

  private _setColorSchemeClass(nextColorScheme: AvailableColorScheme): void {
    if (nextColorScheme === this._activeColorScheme) {
      return;
    }

    this._activeColorScheme = nextColorScheme;
    const prefix = 'jet-color-scheme-';

    this._document.body.className = this._document.body.classList.value
      .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
      .trim();

    if (nextColorScheme !== DEFAULT_COLOR_SCHEME_OPTION.value) {
      this._renderer2.addClass(this._document.body, prefix + nextColorScheme);
    }
  }

  private _setFontClass(nextFontClass: AvailableFontClass): void {
    if (nextFontClass === this._activeFontClass) {
      return;
    }

    this._activeFontClass = nextFontClass;
    const prefix = 'jet-font-';

    this._document.body.className = this._document.body.classList.value
      .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
      .trim();

    if (nextFontClass !== DEFAULT_LANGUAGE_OPTION.fontClass) {
      this._renderer2.addClass(this._document.body, prefix + nextFontClass);
    }
  }

  private _setIcons(): void {
    this._matIconRegistry.addSvgIcon(
      'logo',
      this._domSanitizer.bypassSecurityTrustResourceUrl('./logos/jet.svg'),
    );

    this._matIconRegistry.setDefaultFontSetClass('material-symbols-rounded');
  }

  private _setLanguage(nextLanguageOption: LanguageOption): void {
    if (nextLanguageOption.value === this._activeLanguage) {
      return;
    }

    this._activeLanguage = nextLanguageOption.value;

    this._renderer2.setAttribute(
      this._document.documentElement,
      'lang',
      nextLanguageOption.value,
    );

    this._translocoService.setActiveLang(nextLanguageOption.value);
  }

  private _setSystemColorSchemeListener(): void {
    if (this._systemColorSchemeListener) {
      return;
    }

    this._systemColorSchemeListener = (
      mediaQueryListEvent: MediaQueryListEvent,
    ) => {
      // This updates `<meta name="theme-color" />` based on system setting.
      // This needs to run only when `this._activeColorScheme === 'automatic'`, not otherwise.
      // The listener is set and unset accordingly, so `this._activeColorScheme === 'automatic'` check isn't needed.
      if (mediaQueryListEvent.matches) {
        this._setThemeColor('dark');
      } else {
        this._setThemeColor('light');
      }
    };

    this._darkColorSchemeMediaQuery.addEventListener(
      'change',
      this._systemColorSchemeListener,
    );
  }

  private _setThemeColor(nextColorScheme: AvailableColorScheme): void {
    if (nextColorScheme === 'automatic') {
      nextColorScheme = this._darkColorSchemeMediaQuery.matches
        ? 'dark'
        : 'light';
    }

    const nextColorSchemeOption =
      COLOR_SCHEME_OPTIONS.find(
        (colorSchemeOption) => colorSchemeOption.value === nextColorScheme,
      ) ?? DEFAULT_COLOR_SCHEME_OPTION;

    if (nextColorSchemeOption.themeColor !== this._activeThemeColor) {
      this._activeThemeColor = nextColorSchemeOption.themeColor;

      this._meta.updateTag({
        content: nextColorSchemeOption.themeColor ?? '#ffffff',
        name: 'theme-color',
      });
    }
  }

  private _setZoom(isPwaMode: boolean): void {
    if (isPwaMode) {
      this._meta.updateTag({
        content:
          'width=device-width, initial-scale=0.75, viewport-fit=cover, user-scalable=no',
        name: 'viewport',
      });
    }
  }

  private _unsetSystemColorSchemeListener(): void {
    if (!this._systemColorSchemeListener) {
      return;
    }

    this._darkColorSchemeMediaQuery.removeEventListener(
      'change',
      this._systemColorSchemeListener,
    );

    this._systemColorSchemeListener = null;
  }
}
