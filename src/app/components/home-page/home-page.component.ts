import { Component } from '@angular/core';
import { PageClass } from '@jet/classes/page.class';
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
export class HomePageComponent extends PageClass {
  public constructor(
    protected override readonly _loggerService: LoggerService,
    protected override readonly _titleService: TitleService,
    protected override readonly _translocoService: TranslocoService,
  ) {
    /**
     * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
     *
     * t(jet-home-page.title)
     */

    super(
      'HomePageComponent',
      'jet-home-page.title',
      _loggerService,
      _titleService,
      _translocoService,
    );
  }
}
