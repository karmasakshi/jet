import { Component } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { TitleService } from '@xxx/services/title/title.service';

@Component({
  imports: [TranslocoModule],
  selector: 'xxx-home-page',
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
      this._translocoService.translate('xxx-home-page.title'),
    );

    this._loggerService.logComponentInitialization('HomePageComponent');
  }
}
