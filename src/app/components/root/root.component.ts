import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { DEFAULT_FONT } from '@jet/constants/default-font.constant';
import { DEFAULT_LANGUAGE } from '@jet/constants/default-language.constant';
import { DEFAULT_THEME } from '@jet/constants/default-theme.constant';
import { STORAGE_KEYS } from '@jet/constants/storage-keys.constant';
import { LoaderConfiguration } from '@jet/interfaces/loader-configuration.interface';
import { Page } from '@jet/interfaces/page.interface';
import { Settings } from '@jet/interfaces/settings.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoaderService } from '@jet/services/loader/loader.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { StorageService } from '@jet/services/storage/storage.service';
import { TitleService } from '@jet/services/title/title.service';
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
export class RootComponent implements OnInit, OnDestroy {
  public activeUrl: undefined | Page['url'];
  public isSmallViewport: boolean;
  public loaderConfiguration$: Observable<LoaderConfiguration>;
  public pages: Page[];
  public settings: Settings;
  public title$: Observable<string>;

  private _routerSubscription: Subscription;
  private _swUpdateSubscription: Subscription;

  public constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _renderer2: Renderer2,
    private readonly _router: Router,
    private readonly _swUpdate: SwUpdate,
    private readonly _translocoService: TranslocoService,
    private readonly _alertService: AlertService,
    private readonly _loaderService: LoaderService,
    private readonly _loggerService: LoggerService,
    private readonly _settingsService: SettingsService,
    private readonly _storageService: StorageService,
    private readonly _titleService: TitleService,
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

    this._routerSubscription = Subscription.EMPTY;

    this._swUpdateSubscription = Subscription.EMPTY;

    this._loggerService.logComponentInitialization('RootComponent');
  }

  public ngOnInit(): void {
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

    if (this._swUpdate.isEnabled) {
      this._swUpdateSubscription = this._swUpdate.versionUpdates.subscribe(
        (versionEvent: VersionEvent): void => {
          switch (versionEvent.type) {
            case 'VERSION_DETECTED':
              this._storageService.setLocalStorageItem(
                STORAGE_KEYS.LAST_UPDATE_CHECK_TIMESTAMP,
                new Date().toISOString(),
              );
              this._alertService.showAlert(
                this._translocoService.translate('alerts.downloading-update'),
                this._translocoService.translate('alerts.ok'),
              );
              break;
            case 'VERSION_READY':
              this._alertService.showAlert(
                this._translocoService.translate('alerts.reload-to-update'),
                this._translocoService.translate('alerts.reload'),
                (): void => {
                  location.reload();
                },
              );
              break;
          }
        },
      );
    }

    this._addFontClass(this.settings.languageOption.font);

    this._addLangAttribute(this.settings.languageOption.value);

    this._addThemeClass(this.settings.themeOption.value);
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._swUpdateSubscription.unsubscribe();
  }

  private _addFontClass(availableFont: AvailableFont): void {
    if (availableFont !== DEFAULT_FONT) {
      this._renderer2.addClass(
        document.documentElement,
        `jet-font-${availableFont}`,
      );
    }
  }

  private _addLangAttribute(availableLanguage: AvailableLanguage): void {
    if (availableLanguage !== DEFAULT_LANGUAGE) {
      this._renderer2.setAttribute(
        document.documentElement,
        'lang',
        availableLanguage,
      );
    }
  }

  private _addThemeClass(availableTheme: AvailableTheme): void {
    if (availableTheme === 'automatic') {
      availableTheme = matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    if (availableTheme !== DEFAULT_THEME) {
      this._renderer2.addClass(
        document.documentElement,
        `jet-theme-${availableTheme}`,
      );
    }
  }
}
