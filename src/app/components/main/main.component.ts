import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Language } from '@xxx/interfaces/language.interface';
import { LoaderConfiguration } from '@xxx/interfaces/loader-configuration.interface';
import { Page } from '@xxx/interfaces/page.interface';
import { AlertService } from '@xxx/services/alert/alert.service';
import { LoaderService } from '@xxx/services/loader/loader.service';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { SettingsService } from '@xxx/services/settings/settings.service';
import { Observable, Subscription, filter } from 'rxjs';
import { LanguageMenuComponent } from '../language-menu/language-menu.component';

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
    LanguageMenuComponent,
  ],
  selector: 'xxx-main',
  standalone: true,
  styleUrl: './main.component.scss',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit, OnDestroy {
  public activeUrl: undefined | Page['url'];
  public directionality: Language['directionality'];
  public isSmallViewport: boolean;
  public loaderConfiguration$: Observable<LoaderConfiguration>;
  public pages: Page[];

  private _routerSubscription: Subscription;
  private _swUpdateSubscription: Subscription;

  public constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _router: Router,
    private readonly _swUpdate: SwUpdate,
    private readonly _translocoService: TranslocoService,
    private readonly _alertService: AlertService,
    private readonly _loaderService: LoaderService,
    private readonly _loggerService: LoggerService,
    private readonly _settingsService: SettingsService,
  ) {
    this.activeUrl = undefined;

    this.directionality =
      this._settingsService.settings.language.directionality;

    this.isSmallViewport = this._breakpointObserver.isMatched([
      Breakpoints.Handset,
      Breakpoints.Tablet,
    ]);

    this.loaderConfiguration$ = this._loaderService.loaderConfiguration$;

    this.pages = [
      {
        icon: 'home',
        titleKey: 'home',
        url: '/',
      },
      {
        icon: 'settings',
        titleKey: 'settings',
        url: '/settings',
      },
    ];

    this._routerSubscription = Subscription.EMPTY;

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
              this._alertService.showAlert(
                this._translocoService.translate(
                  'alerts.downloading-new-version',
                ),
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
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._swUpdateSubscription.unsubscribe();
  }
}
