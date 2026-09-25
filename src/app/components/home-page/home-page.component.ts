import { Component, inject } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [TranslocoModule, PageComponent],
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
