import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
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
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);

  public isLoginPending: boolean;

  public constructor() {
    this.isLoginPending = false;

    this._loggerService.logComponentInitialization('LoginPageComponent');
  }

  public login(): void {
    if (!this.isLoginPending) {
      this.isLoginPending = true;
      this._progressBarService.showProgressBar();
      this._authenticationService
        .login()
        .then((): void => {
          this._progressBarService.hideProgressBar();
          this.isLoginPending = false;
          const returnUrl =
            this._activatedRoute.snapshot.queryParamMap.get(
              QueryParam.ReturnUrl,
            ) ?? '/';
          void this._router.navigateByUrl(returnUrl);
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert();
          this._progressBarService.hideProgressBar();
          this.isLoginPending = false;
        });
    }
  }
}
