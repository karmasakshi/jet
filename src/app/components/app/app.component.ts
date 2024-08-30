import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  Signal,
  computed,
  inject,
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
  NavigationEnd,
  Router,
  RouterEvent,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { DEFAULT_FONT } from '@jet/constants/default-font.constant';
import { DEFAULT_LANGUAGE } from '@jet/constants/default-language.constant';
import { DEFAULT_THEME } from '@jet/constants/default-theme.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { User } from '@jet/interfaces/user.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { UpdateService } from '@jet/services/update/update.service';
import { AvailableFont } from '@jet/types/available-font.type';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { AvailableTheme } from '@jet/types/available-theme.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  imports: [
    NgClass,
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

  private readonly _isPwaMode: boolean;
  private _routerSubscription: Subscription;
  private _swUpdateSubscription: Subscription;

  public activeNavigationMenuItemUrl: NavigationMenuItem['url'] | undefined;
  public readonly isSmallViewport: boolean;
  public readonly navigationMenuItems: NavigationMenuItem[];
  public readonly progressBarConfiguration: Signal<ProgressBarConfiguration>;
  public readonly settings: Settings;
  public readonly toolbarTitle: Signal<string>;
  public readonly user: Signal<User | null>;

  public constructor() {
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

    this.progressBarConfiguration = computed(() =>
      this._progressBarService.progressBarConfiguration(),
    );

    this.settings = this._settingsService.settings();

    this.toolbarTitle = computed(() =>
      this._toolbarTitleService.toolbarTitle(),
    );

    this.user = computed(() => this._authenticationService.user());

    this._loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Start', `v${packageJson.version}`);

    this._routerSubscription = this._router.events
      .pipe(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        filter<any>(
          (routerEvent: RouterEvent): boolean =>
            routerEvent instanceof NavigationEnd,
        ),
      )
      .subscribe((navigationEnd: NavigationEnd): void => {
        this.activeNavigationMenuItemUrl = navigationEnd.url;
      });

    this._swUpdateSubscription = this._updateService.swUpdateSubscription;

    this._addFontClass(this.settings.languageOption.font);

    this._addThemeClass(this.settings.themeOption.value);

    this._setLanguage(this.settings.languageOption.value);

    this._setZoom(this._isPwaMode);
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._swUpdateSubscription.unsubscribe();
  }

  private _addFontClass(activeFont: AvailableFont): void {
    if (activeFont !== DEFAULT_FONT) {
      this._renderer2.addClass(document.body, `jet-font-${activeFont}`);
    }
  }

  private _addThemeClass(activeTheme: AvailableTheme): void {
    if (activeTheme === 'automatic') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (activeTheme !== DEFAULT_THEME) {
      this._renderer2.addClass(document.body, `jet-theme-${activeTheme}`);
    }
  }

  private _setLanguage(activeLanguage: AvailableLanguage): void {
    if (activeLanguage !== DEFAULT_LANGUAGE) {
      this._translocoService.setActiveLang(activeLanguage);

      this._renderer2.setAttribute(
        document.documentElement,
        'lang',
        activeLanguage,
      );
    }
  }

  private _setZoom(isPwaMode: boolean): void {
    if (isPwaMode) {
      this._meta.updateTag({
        content:
          'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover',
        name: 'viewport',
      });
    }
  }
}
