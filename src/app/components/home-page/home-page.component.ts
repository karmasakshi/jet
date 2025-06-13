import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { Page } from '../page/page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, Page],
  selector: 'jet-home-page',
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logComponentInitialization('HomePageComponent');
  }
}
