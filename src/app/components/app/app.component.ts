import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
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
import { APP_VERSION } from '@jet/constants/app-version.constant';
import { NAV_ITEMS } from '@jet/constants/nav-items.constant';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { NavItem } from '@jet/interfaces/nav-item.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { BadgeContentService } from '@jet/services/badge-content/badge-content.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { celebrationFillIcon } from '@jet/svgs/celebration-fill';
import { historyFillIcon } from '@jet/svgs/history-fill';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { tuneFillIcon } from '@jet/svgs/tune-fill';
import { Badge } from '@jet/types/badge.type';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  imports: [
    MatBadgeModule,
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
  styles: ``,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #analyticsService = inject(AnalyticsService);
  readonly #badgeContentService = inject(BadgeContentService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #settingsService = inject(SettingsService);

  protected activeNavItemPath: NavItem['path'] | undefined;
  protected readonly directionality: Signal<LanguageOption['directionality']>;
  protected readonly isLargeViewport: Signal<boolean>;
  protected readonly isMatSidenavOpen: WritableSignal<boolean>;
  protected readonly matSidenavMode: Signal<MatDrawerMode>;
  protected readonly navItems: NavItem[];
  protected readonly shouldAddSafeArea: Signal<boolean>;

  public constructor() {
    addSvgIconLiteral([
      celebrationFillIcon,
      historyFillIcon,
      homeFillIcon,
      personFillIcon,
      tuneFillIcon,
    ]);

    this.activeNavItemPath = undefined;

    this.directionality = this.#settingsService.directionality;

    // To continuously listen to viewport changes, set
    // this.isLargeViewport = toSignal(
    //   this.#breakpointObserver
    //     .observe(Breakpoints.Web)
    //     .pipe(map((result) => result.matches)),
    //   { initialValue: false },
    // );
    this.isLargeViewport = signal(this.#breakpointObserver.isMatched(Breakpoints.Web));

    // To keep MatSidenav closed by default on large viewports, set
    // this.isMatSidenavOpen = signal(false);
    // and
    // @defer (on idle) { <jet-sidenav ... /> }
    this.isMatSidenavOpen = linkedSignal(() => this.isLargeViewport());

    this.matSidenavMode = computed(() => (this.isLargeViewport() ? 'side' : 'over'));

    this.navItems = NAV_ITEMS;

    this.shouldAddSafeArea = computed(() =>
      this.matSidenavMode() === 'over' ? true : !this.isMatSidenavOpen(),
    );

    this.#loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this.#analyticsService.logAnalyticsEvent({ data: { version: APP_VERSION }, name: 'start' });

    this.#router.events
      .pipe(
        filter(
          (event: Event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationCancel ||
            event instanceof NavigationEnd ||
            event instanceof NavigationError,
        ),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this.#progressBarService.showQueryProgressBar();
          return;
        }

        if (event instanceof NavigationEnd) {
          this.activeNavItemPath = event.url.split('?')[0];
        }

        if (event instanceof NavigationError) {
          const error = event.error;

          this.#loggerService.logException(error);

          this.#alertService.showExceptionAlert(error);
        }

        this.#progressBarService.hideProgressBar();
      });
  }

  public getBadgeContent(badge: Badge | null): null | number | string {
    return this.#badgeContentService.getBadgeContent(badge);
  }
}
