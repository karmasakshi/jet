import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AsyncPipe,
  NgClass,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { LoaderConfiguration } from '@jet/interfaces/loader-configuration.interface';
import { Page } from '@jet/interfaces/page.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { LoaderService } from '@jet/services/loader/loader.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { TitleService } from '@jet/services/title/title.service';
import { UpdateService } from '@jet/services/update/update.service';
import { AvailableFont } from '@jet/types/available-font.type';
import { AvailableLanguage } from '@jet/types/available-language.type';
import { AvailableTheme } from '@jet/types/available-theme.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
    TranslocoModule,
  ],
  selector: 'jet-root',
  standalone: true,
  styleUrl: './root.component.scss',
  templateUrl: './root.component.html',
})
export class RootComponent implements OnDestroy {
  public activeUrl: Page['url'] | undefined;
  public readonly isSmallViewport: boolean;
  public readonly loaderConfiguration$: Observable<LoaderConfiguration>;
  public readonly pages: Page[];
  public readonly settings: Settings;
  public readonly title$: Observable<string>;

  private _routerSubscription: Subscription;
  private _swUpdateSubscription: Subscription;

  public constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _renderer2: Renderer2,
    private readonly _router: Router,
    private readonly _loaderService: LoaderService,
    private readonly _loggerService: LoggerService,
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

    this.loaderConfiguration$ = this._loaderService.loaderConfiguration$;

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-root.home)
     * t(jet-root.settings)
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

    this.settings = this._settingsService.settings;

    this.title$ = this._titleService.title$;

    this._routerSubscription = this._router.events
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    this._loggerService.logComponentInitialization('RootComponent');
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
}
