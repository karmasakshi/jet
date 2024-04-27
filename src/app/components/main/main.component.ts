import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
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
  RouterModule,
} from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DEFAULT_FONT } from '@xxx/constants/default-font.constant';
import { STORAGE_KEYS } from '@xxx/constants/storage-keys.constant';
import { LanguageOption } from '@xxx/interfaces/language-option.interface';
import { LoaderConfiguration } from '@xxx/interfaces/loader-configuration.interface';
import { Page } from '@xxx/interfaces/page.interface';
import { Settings } from '@xxx/interfaces/settings.interface';
import { AlertService } from '@xxx/services/alert/alert.service';
import { LoaderService } from '@xxx/services/loader/loader.service';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { SettingsService } from '@xxx/services/settings/settings.service';
import { StorageService } from '@xxx/services/storage/storage.service';
import { TitleService } from '@xxx/services/title/title.service';
import { AvailableFont } from '@xxx/types/available-font.type';
import { AvailableTheme } from '@xxx/types/available-theme.type';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule,
    TranslocoModule,
  ],
  selector: 'xxx-main',
  standalone: true,
  styleUrl: './main.component.scss',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy {
  public activeUrl: undefined | Page['url'];
  public directionality: LanguageOption['directionality'];
  public isSmallViewport: boolean;
  public loaderConfiguration$: Observable<LoaderConfiguration>;
  public pages: Page[];
  public title$: Observable<string>;

  private _routerSubscription: Subscription;
  private _settings: Settings;
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

    this.directionality =
      this._settingsService.settings.languageOption.directionality;

    this.isSmallViewport = this._breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]);

    this.loaderConfiguration$ = this._loaderService.loaderConfiguration$;

    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(xxx-main.home)
     * t(xxx-main.settings)
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

    this.title$ = this._titleService.title$;

    this._routerSubscription = Subscription.EMPTY;

    this._settings = this._settingsService.settings;

    this._swUpdateSubscription = Subscription.EMPTY;

    this._loggerService.logComponentInitialization('MainComponent');
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
                this._translocoService.translate('alerts.ok-cta'),
              );
              break;
            case 'VERSION_READY':
              this._alertService.showAlert(
                this._translocoService.translate('alerts.reload-to-update'),
                this._translocoService.translate('alerts.reload-cta'),
                (): void => {
                  location.reload();
                },
              );
              break;
          }
        },
      );
    }

    this._addFontClass(this._settings.languageOption.font);

    this._addThemeClass(this._settings.themeOption.value);
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._swUpdateSubscription.unsubscribe();
  }

  private _addFontClass(availableFont: AvailableFont): void {
    if (availableFont !== DEFAULT_FONT) {
      this._renderer2.addClass(
        document.documentElement,
        `xxx-font-${availableFont}`,
      );
    }
  }

  private _addThemeClass(availableTheme: AvailableTheme): void {
    if (availableTheme === 'automatic') {
      availableTheme = matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    this._renderer2.addClass(
      document.documentElement,
      `xxx-theme-${availableTheme}`,
    );
  }
}
