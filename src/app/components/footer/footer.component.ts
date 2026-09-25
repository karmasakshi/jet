import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { APP_VERSION } from '@jet/constants/app-version.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { LoggerService } from '@jet/services/logger/logger.service';
import { alternateEmailFillIcon } from '@jet/svgs/alternate_email-fill';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  imports: [MatButtonModule, MatDividerModule, MatIconModule, AnalyticsDirective, TranslocoModule],
  selector: 'jet-footer',
  styles: ``,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly #loggerService = inject(LoggerService);

  protected readonly version: string;

  public constructor() {
    addSvgIconLiteral([alternateEmailFillIcon]);

    this.version = APP_VERSION;

    this.#loggerService.logComponentInitialization('FooterComponent');
  }
}
