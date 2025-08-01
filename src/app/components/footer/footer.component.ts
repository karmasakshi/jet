import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    AnalyticsDirective,
    TranslocoModule,
  ],
  selector: 'jet-footer',
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logComponentInitialization('FooterComponent');
  }
}
