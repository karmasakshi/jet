import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NAVIGATION_MENU_ITEMS } from '@jet/constants/navigation-menu-items.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterLink,
    AnalyticsDirective,
    TranslocoModule,
  ],
  selector: 'jet-sidenav',
  styleUrl: './sidenav.component.scss',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly activeNavigationMenuItemPath = input.required<
    string | undefined
  >();

  protected readonly clickNavigationMenuItem = output<void>();

  protected readonly navigationMenuItems: NavigationMenuItem[];

  public constructor() {
    this.navigationMenuItems = NAVIGATION_MENU_ITEMS;

    this.#loggerService.logComponentInitialization('SidenavComponent');
  }
}
