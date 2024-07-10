import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AsyncPipe,
  NgClass,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
import { ProgressBarConfiguration } from '@jet/interfaces/progress-bar-configuration.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { TitleService } from '@jet/services/title/title.service';
import { UpdateService } from '@jet/services/update/update.service';
import { AvailableFont } from '@jet/types/available-font.type';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { AvailableTheme } from '@jet/types/available-theme.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import packageJson from 'package.json';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Page {
  icon: string;
  nameKey: string;
  url: string;
}

@Component({
  imports: [
    AsyncPipe,
    NgClass,
    NgOptimizedImage,
    NgTemplateOutlet,
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
  public activeUrl: Page['url'] | undefined;
  public readonly isSmallViewport: boolean;
  public readonly pages: Page[];
  public readonly progressBarConfiguration$: Observable<ProgressBarConfiguration>;
  public readonly settings: Settings;
  public readonly title$: Observable<string>;

  private readonly _isPwaMode: boolean;
  private _routerSubscription: Subscription;
  private _swUpdateSubscription: Subscription;

  public constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _renderer2: Renderer2,
    private readonly _meta: Meta,
    private readonly _router: Router,
    private readonly _analyticsService: AnalyticsService,
    private readonly _loggerService: LoggerService,
    private readonly _progressBarService: ProgressBarService,
    private readonly _settingsService: SettingsService,
    private readonly _titleService: TitleService,
    private readonly _updateService: UpdateService,
    private readonly _translocoService: TranslocoService,
  ) {
    this.activeUrl = undefined;

    this.isSmallViewport = this._breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]);

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-app.home)
     * t(jet-app.settings)
     */

    this.pages = [
      {
        icon: 'home',
        nameKey: 'home',
        url: '/',
      },
      {
        icon: 'settings',
        nameKey: 'settings',
        url: '/settings',
      },
    ];

    this.progressBarConfiguration$ =
      this._progressBarService.progressBarConfiguration$;

    this.settings = this._settingsService.settings;

    this.title$ = this._titleService.title$;

    this._isPwaMode = window.matchMedia('(display-mode: standalone)').matches;

    this._routerSubscription = Subscription.EMPTY;

    this._swUpdateSubscription = Subscription.EMPTY;

    this._loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this._analyticsService.logEvent('Start', packageJson.version);

    this._routerSubscription = this._router.events
      .pipe(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        filter<any>(
          (routerEvent: RouterEvent): boolean =>
            routerEvent instanceof NavigationEnd,
        ),
      )
      .subscribe((navigationEnd: NavigationEnd): void => {
        this.activeUrl = navigationEnd.url;
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

  private _addFontClass(availableFont: AvailableFont): void {
    if (availableFont !== DEFAULT_FONT) {
      this._renderer2.addClass(document.body, `jet-font-${availableFont}`);
    }
  }

  private _addThemeClass(availableTheme: AvailableTheme): void {
    if (availableTheme === 'automatic') {
      availableTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (availableTheme !== DEFAULT_THEME) {
      this._renderer2.addClass(document.body, `jet-theme-${availableTheme}`);
    }
  }

  private _setLanguage(availableLanguage: AvailableLanguage): void {
    if (availableLanguage !== DEFAULT_LANGUAGE) {
      this._translocoService.setActiveLang(availableLanguage);

      this._renderer2.setAttribute(
        document.documentElement,
        'lang',
        availableLanguage,
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
