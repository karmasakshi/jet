import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  computed,
  inject,
  linkedSignal,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { APP_VERSION } from '@jet/constants/app-version.constant';
import { NAV_ITEMS } from '@jet/constants/nav-items.constant';
import { NavItem } from '@jet/interfaces/nav-item.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { BadgeContentService } from '@jet/services/badge-content/badge-content.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { NavItemService } from '@jet/services/nav-item/nav-item.service';
import { SettingsService } from '@jet/services/settings/settings.service';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { tuneFillIcon } from '@jet/svgs/tune-fill';
import { Badge } from '@jet/types/badge.type';
import { Direction } from '@jet/types/direction.type';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { TranslocoModule } from '@jsverse/transloco';
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
  readonly #analyticsService = inject(AnalyticsService);
  readonly #badgeContentService = inject(BadgeContentService);
  readonly #loggerService = inject(LoggerService);
  readonly #navItemService = inject(NavItemService);
  readonly #settingsService = inject(SettingsService);

  protected readonly direction: Signal<Direction>;
  protected readonly isLargeViewport: Signal<boolean>;
  protected readonly isMatSidenavOpen: WritableSignal<boolean>;
  protected readonly matSidenavMode: Signal<MatDrawerMode>;
  protected readonly navItemPath: Signal<NavItem['path'] | undefined>;
  protected readonly navItems: NavItem[];
  protected readonly shouldAddSafeArea: Signal<boolean>;

  public constructor() {
    addSvgIconLiteral([homeFillIcon, personFillIcon, tuneFillIcon]);

    this.direction = this.#settingsService.direction;

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

    this.navItemPath = this.#navItemService.activeNavItemPath;

    this.navItems = NAV_ITEMS;

    this.shouldAddSafeArea = computed(() =>
      this.matSidenavMode() === 'over' ? true : !this.isMatSidenavOpen(),
    );

    this.#loggerService.logComponentInitialization('AppComponent');
  }

  public ngOnInit(): void {
    this.#analyticsService.logAnalyticsEvent({ data: { version: APP_VERSION }, name: 'start' });
  }

  public getBadgeContent(badge: Badge | null): null | number | string {
    return this.#badgeContentService.getBadgeContent(badge);
  }
}
