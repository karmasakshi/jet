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
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Meta } from '@angular/platform-browser';
import {
  Event,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { DEFAULT_FONT } from '@jet/constants/default-font.constant';
import { DEFAULT_LANGUAGE } from '@jet/constants/default-language.constant';
import { DEFAULT_THEME } from '@jet/constants/default-theme.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { ThemeOption } from '@jet/interfaces/theme-option.interface';
import { User } from '@jet/interfaces/user.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { UpdateService } from '@jet/services/update/update.service';
import { AvailableFont } from '@jet/types/available-font.type';
import { AvailableTheme } from '@jet/types/available-theme.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  imports: [
    NgClass,
    NgStyle,
    NgOptimizedImage,
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
  ],
  selector: 'jet-app',
  standalone: true,
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _document = inject(DOCUMENT);
  private readonly _renderer2 = inject(Renderer2);
  private readonly _meta = inject(Meta);
  private readonly _router = inject(Router);
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _settingsService = inject(SettingsService);
  private readonly _toolbarTitleService = inject(ToolbarTitleService);
  private readonly _updateService = inject(UpdateService);
  private readonly _translocoService = inject(TranslocoService);

  private _activeFont: LanguageOption['font'];
  private _activeLanguage: LanguageOption['value'];
  private _activeTheme: ThemeOption['value'];
  private readonly _isPwaMode: boolean;
  private _routerSubscription: Subscription;
  private _swUpdateSubscription: Subscription;

  public activeNavigationMenuItemUrl: NavigationMenuItem['url'] | undefined;
  public readonly isSmallViewport: boolean;
  public readonly navigationMenuItems: NavigationMenuItem[];
  public readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  public readonly settings: Signal<Settings>;
  public readonly toolbarTitle: Signal<string>;
  public readonly user: Signal<User | null>;

  public constructor() {
    this._activeFont = DEFAULT_FONT;

    this._activeLanguage = DEFAULT_LANGUAGE;

    this._activeTheme = DEFAULT_THEME;

    this._isPwaMode = window.matchMedia('(display-mode: standalone)').matches;

    this._routerSubscription = Subscription.EMPTY;

    this._swUpdateSubscription = Subscription.EMPTY;

    this.activeNavigationMenuItemUrl = undefined;

    this.isSmallViewport = this._breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]);

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-app.home)
     * t(jet-app.account)
     * t(jet-app.settings)
     */

    this.navigationMenuItems = [
      {
        icon: 'home',
        nameKey: 'home',
        url: '/',
      },
      {
        icon: 'account_circle',
        nameKey: 'account',
        url: '/account',
      },
      {
        icon: 'settings',
        nameKey: 'settings',
        url: '/settings',
      },
    ];

    this.progressBarConfiguration =
      this._progressBarService.progressBarConfiguration;

    this.settings = this._settingsService.settings;

    this.toolbarTitle = this._toolbarTitleService.toolbarTitle;

    this.user = this._authenticationService.user;

    effect(() => {
      const settings: Settings = this.settings();
      untracked(() => {
        requestAnimationFrame(() => {
          this._setFontClass(settings.languageOption.font);
          this._setLanguage(settings.languageOption);
          this._setThemeClass(settings.themeOption.value);
        });
      });
    });

    this._loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Start', `v${packageJson.version}`);

    this._routerSubscription = this._router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe((navigationEnd: NavigationEnd): void => {
        this.activeNavigationMenuItemUrl = navigationEnd.url;
      });

    this._swUpdateSubscription = this._updateService.swUpdateSubscription;

    this._disableZoom(this._isPwaMode);
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._swUpdateSubscription.unsubscribe();
  }

  private _disableZoom(isPwaMode: boolean): void {
    if (isPwaMode) {
      this._meta.updateTag({
        content:
          'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
        name: 'viewport',
      });
    }
  }

  private _setFontClass(activeFont: AvailableFont): void {
    if (activeFont !== this._activeFont) {
      this._activeFont = activeFont;
      const prefix = 'jet-font-';
      this._document.body.classList.forEach((className) => {
        if (className.startsWith(prefix)) {
          this._renderer2.removeClass(this._document.body, className);
        }
      });
      if (activeFont !== DEFAULT_FONT) {
        this._renderer2.addClass(this._document.body, prefix + activeFont);
      }
    }
  }

  private _setLanguage(activeLanguageOption: LanguageOption): void {
    if (activeLanguageOption.value !== this._activeLanguage) {
      this._activeLanguage = activeLanguageOption.value;
      this._renderer2.setAttribute(
        this._document.body,
        'dir',
        activeLanguageOption.directionality,
      );
      this._renderer2.setAttribute(
        this._document.documentElement,
        'lang',
        activeLanguageOption.value,
      );
      this._translocoService.setActiveLang(activeLanguageOption.value);
    }
  }

  private _setThemeClass(activeTheme: AvailableTheme): void {
    if (activeTheme === 'automatic') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (activeTheme !== this._activeTheme) {
      this._activeTheme = activeTheme;
      const prefix = 'jet-theme-';
      this._document.body.classList.forEach((className) => {
        if (className.startsWith(prefix)) {
          this._renderer2.removeClass(this._document.body, className);
        }
      });
      if (activeTheme !== DEFAULT_THEME) {
        this._renderer2.addClass(this._document.body, prefix + activeTheme);
      }
    }
  }
}
