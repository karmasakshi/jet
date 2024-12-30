import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DOCUMENT, NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  Signal,
  effect,
  inject,
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
import { Meta } from '@angular/platform-browser';
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
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { User } from '@jet/interfaces/user.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { UserService } from '@jet/services/user/user.service';
import { AvailableColorScheme } from '@jet/types/available-color-scheme.type';
import { AvailableFont } from '@jet/types/available-font.type';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';

@Component({
  imports: [
    NgClass,
    NgOptimizedImage,
    NgStyle,
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
    AnalyticsDirective,
    TranslocoModule,
    FooterComponent,
  ],
  selector: 'jet-app',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _document = inject(DOCUMENT);
  private readonly _renderer2 = inject(Renderer2);
  private readonly _matIconRegistry = inject(MatIconRegistry);
  private readonly _meta = inject(Meta);
  private readonly _router = inject(Router);
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _serviceWorkerService = inject(ServiceWorkerService);
  private readonly _settingsService = inject(SettingsService);
  private readonly _toolbarTitleService = inject(ToolbarTitleService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private _activeFont: AvailableFont;
  private _activeLanguage: AvailableLanguage;
  private _activeColorScheme: AvailableColorScheme;
  private _activeThemeColor: ColorSchemeOption['themeColor'];
  private readonly _darkColorSchemeMediaQuery: MediaQueryList;
  private _systemColorSchemeListener:
    | ((mediaQueryListEvent: MediaQueryListEvent) => void)
    | undefined;
  private readonly _isPwaMode: boolean;
  private _routerSubscription: Subscription;
  private _serviceWorkerUpdateSubscription: Subscription;

  public activeNavigationMenuItemPath: NavigationMenuItem['path'] | undefined;
  public readonly isSmallViewport: boolean;
  public readonly languageOption: Signal<LanguageOption>;
  public readonly navigationMenuItems: NavigationMenuItem[];
  public readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  public readonly toolbarTitle: Signal<string | undefined>;
  public readonly user: Signal<User | null>;

  public constructor() {
    this._activeFont = DEFAULT_LANGUAGE_OPTION.font;

    this._activeLanguage = DEFAULT_LANGUAGE_OPTION.value;

    this._activeColorScheme = DEFAULT_COLOR_SCHEME_OPTION.value;

    this._activeThemeColor = DEFAULT_COLOR_SCHEME_OPTION.themeColor;

    this._darkColorSchemeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

    this._systemColorSchemeListener = undefined;

    this._isPwaMode = window.matchMedia('(display-mode: standalone)').matches;

    this._routerSubscription = Subscription.EMPTY;

    this._serviceWorkerUpdateSubscription = Subscription.EMPTY;

    this.activeNavigationMenuItemPath = undefined;

    this.isSmallViewport = this._breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]);

    this.languageOption = this._settingsService.languageOption;

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-app.home)
     * t(jet-app.profile)
     * t(jet-app.settings)
     */

    this.navigationMenuItems = NAVIGATION_MENU_ITEMS;

    this.progressBarConfiguration =
      this._progressBarService.progressBarConfiguration;

    this.toolbarTitle = this._toolbarTitleService.toolbarTitle;

    this.user = this._userService.user;

    effect(() => {
      const languageOption: LanguageOption = this.languageOption();
      untracked(() => {
        this._setFontClass(languageOption.font);
        this._setLanguage(languageOption);
      });
    });

    effect(() => {
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

    this._loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Start', {
      version: `v${packageJson.version}`,
    });

    this._routerSubscription = this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this._progressBarService.showProgressBar();
      } else if (
        event instanceof NavigationCancel ||
        event instanceof NavigationEnd ||
        event instanceof NavigationError
      ) {
        if (event instanceof NavigationEnd) {
          this.activeNavigationMenuItemPath = event.url.split('?')[0];
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

  private _unsetSystemColorSchemeListener(): void {
    if (!this._systemColorSchemeListener) {
      return;
    }

    this._darkColorSchemeMediaQuery.removeEventListener(
      'change',
      this._systemColorSchemeListener,
    );
    this._systemColorSchemeListener = undefined;
  }

  private _setFontClass(nextFont: AvailableFont): void {
    if (nextFont === this._activeFont) {
      return;
    }

    this._activeFont = nextFont;
    const prefix = 'jet-font-';
    this._document.body.className = this._document.body.classList.value
      .replace(new RegExp(`${prefix}\\S+`, 'g'), '')
      .trim();

    if (nextFont !== DEFAULT_LANGUAGE_OPTION.font) {
      this._renderer2.addClass(this._document.body, prefix + nextFont);
    }
  }

  private _setIcons(): void {
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

    this._renderer2.setAttribute(
      this._document.body,
      'dir',
      nextLanguageOption.directionality,
    );

    this._translocoService.setActiveLang(nextLanguageOption.value);
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
          'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
        name: 'viewport',
      });
    }
  }
}
