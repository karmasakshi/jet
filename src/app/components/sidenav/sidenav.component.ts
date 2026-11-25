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
import { Badge } from '@jet/types/badge.type';
import { addSvgIcons } from '@jet/utilities/add-svg-icons.utility';
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

  protected readonly clickNavItem = output<void>();
  protected readonly navItems: NavItem[];

  public readonly navItemPath = input.required<string | undefined>();

  public constructor() {
    addSvgIcons(NAV_ITEMS.map(({ svgIcon }) => svgIcon));

    this.navItems = NAV_ITEMS;

    this.#loggerService.logComponentInitialization('SidenavComponent');
  }

  protected getBadgeContent(badge: Badge | null): null | number | string {
    return this.#badgeContentService.getBadgeContent(badge);
  }
}
