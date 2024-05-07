import { Component } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TitleService } from '@jet/services/title/title.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  imports: [TranslocoModule],
  selector: 'jet-home-page',
  standalone: true,
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  public constructor(
    private readonly _translocoService: TranslocoService,
    private readonly _loggerService: LoggerService,
    private readonly _titleService: TitleService,
  ) {
    this._titleService.setTitle(
      this._translocoService.translate('jet-home-page.title'),
    );

    this._loggerService.logComponentInitialization('HomePageComponent');
  }
}
