import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [MatButtonModule, MatIconModule, TranslocoModule, PageComponent],
  selector: 'jet-sign-up-page',
  styleUrl: './sign-up-page.component.scss',
  templateUrl: './sign-up-page.component.html',
})
export class SignUpPageComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _translocoService = inject(TranslocoService);

  public isGetSessionPending: boolean;
  public isSignUpPending: boolean;

  public constructor() {
    this.isGetSessionPending = false;

    this.isSignUpPending = false;

    this._loggerService.logComponentInitialization('SignUpPageComponent');
  }

  public signUp(): void {
    if (!this.isSignUpPending) {
      this.isSignUpPending = true;

      this._progressBarService.showProgressBar();

      this._authenticationService
        .signUp('', '')
        .then(({ data, error }): void => {
          this._progressBarService.hideProgressBar();

          this.isSignUpPending = false;

          if (error) {
            this._loggerService.logError(error);

            this._alertService.showErrorAlert(error.message);
          } else {
            if (data.user === null) {
              this._alertService.showErrorAlert();
            } else {
              this._alertService.showAlert(
                this._translocoService.translate('alerts.welcome'),
              );

              const returnUrl =
                this._activatedRoute.snapshot.queryParamMap.get(
                  QueryParam.ReturnUrl,
                ) ?? '/';

              void this._router.navigateByUrl(returnUrl);
            }
          }
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert(error.message);

          this._progressBarService.hideProgressBar();

          this.isSignUpPending = false;
        });
    }
  }
}
