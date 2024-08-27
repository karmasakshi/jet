import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [MatButtonModule, TranslocoModule, PageComponent],
  selector: 'jet-login-page',
  standalone: true,
  styleUrl: './login-page.component.scss',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _router = inject(Router);

  public constructor() {
    this._loggerService.logComponentInitialization('LoginPageComponent');
  }

  public login(): void {
    this._authenticationService
      .login()
      .then(() => {
        const returnUrl =
          this._activatedRoute.snapshot.queryParamMap.get(
            QueryParam.ReturnUrl,
          ) ?? '/';
        void this._router.navigateByUrl(returnUrl);
      })
      .catch((error) => this._loggerService.logError(error));
  }
}
