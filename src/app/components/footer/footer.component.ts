import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  imports: [MatButtonModule, TranslocoModule],
  selector: 'jet-footer',
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logComponentInitialization('FooterComponent');
  }
}
