import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LoggerService } from '@xxx/services/logger/logger.service';

@Component({
  imports: [TranslocoModule],
  selector: 'xxx-home-page',
  standalone: true,
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  public constructor(private readonly _loggerService: LoggerService) {
    this._loggerService.logComponentInitialization('HomePageComponent');
  }
}
