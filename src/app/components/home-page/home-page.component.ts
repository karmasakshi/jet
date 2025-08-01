import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-home-page',
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logComponentInitialization('HomePageComponent');
  }
}
