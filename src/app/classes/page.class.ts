import { LoggerService } from '@jet/services/logger/logger.service';
import { TitleService } from '@jet/services/title/title.service';
import { TranslocoService } from '@jsverse/transloco';

export abstract class PageClass {
  protected constructor(
    private readonly _componentName: string,
    private readonly _titleKey: string,
    protected readonly _loggerService: LoggerService,
    protected readonly _titleService: TitleService,
    protected readonly _translocoService: TranslocoService,
  ) {
    this._titleService.setTitle(
      this._translocoService.translate(this._titleKey),
    );

    this._loggerService.logComponentInitialization(this._componentName);
  }
}
