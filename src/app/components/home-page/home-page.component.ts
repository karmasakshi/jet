import { Component, inject } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  imports: [TranslocoModule],
  selector: 'jet-home-page',
  styles: ``,
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logComponentInitialization('HomePageComponent');
  }
}
