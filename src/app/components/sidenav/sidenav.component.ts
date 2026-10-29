import { Component, inject, input, output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS } from '@jet/constants/nav-items.constant';
import { AnalyticsEventDirective } from '@jet/directives/analytics-event/analytics-event.directive';
import { NavItem } from '@jet/interfaces/nav-item.interface';
import { BadgeContentService } from '@jet/services/badge-content/badge-content.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { tuneFillIcon } from '@jet/svgs/tune-fill';
import { Badge } from '@jet/types/badge.type';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterLink,
    AnalyticsEventDirective,
    TranslocoModule,
  ],
  selector: 'jet-sidenav',
  styles: ``,
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  readonly #badgeContentService = inject(BadgeContentService);
  readonly #loggerService = inject(LoggerService);

  public readonly activeNavItemPath = input.required<string | undefined>();

  protected readonly clickNavItem = output<void>();

  protected readonly navItems: NavItem[];

  public constructor() {
    addSvgIconLiteral([homeFillIcon, personFillIcon, tuneFillIcon]);

    this.navItems = NAV_ITEMS;

    this.#loggerService.logComponentInitialization('SidenavComponent');
  }

  public getBadgeContent(badge: Badge | null): null | number | string {
    return this.#badgeContentService.getBadgeContent(badge);
  }
}
