import { Component, inject } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-account-page',
  standalone: true,
  styleUrl: './account-page.component.scss',
  templateUrl: './account-page.component.html',
})
export class AccountPageComponent {
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logComponentInitialization('AccountPageComponent');
  }
}
