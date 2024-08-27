import { Component, OnInit, inject } from '@angular/core';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-logout-page',
  standalone: true,
  styleUrl: './logout-page.component.scss',
  templateUrl: './logout-page.component.html',
})
export class LogoutPageComponent implements OnInit {
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logComponentInitialization('LogoutPageComponent');
  }

  public ngOnInit(): void {
    this._authenticationService
      .logout()
      .then()
      .catch((error) => {
        this._loggerService.logError(error);
      });
  }
}
