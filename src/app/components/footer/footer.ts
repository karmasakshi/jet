import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Analytics } from '@jet/directives/analytics/analytics';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, Analytics, TranslocoModule],
  selector: 'jet-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logComponentInitialization('Footer');
  }
}
