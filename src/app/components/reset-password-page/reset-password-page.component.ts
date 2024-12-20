import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [MatButtonModule, MatIconModule, TranslocoModule, PageComponent],
  selector: 'jet-reset-password-page',
  styleUrl: './reset-password-page.component.scss',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent {
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _translocoService = inject(TranslocoService);

  public isResetPasswordPending: boolean;

  public constructor() {
    this.isResetPasswordPending = false;

    this._loggerService.logComponentInitialization(
      'ResetPasswordPageComponent',
    );
  }

  public resetPassword(): void {
    if (!this.isResetPasswordPending) {
      this.isResetPasswordPending = true;

      this._progressBarService.showProgressBar();

      this._authenticationService
        .resetPassword('')
        .then(({ error }): void => {
          this._progressBarService.hideProgressBar();

          this.isResetPasswordPending = false;

          if (error) {
            this._loggerService.logError(error);

            this._alertService.showErrorAlert(error.message);
          } else {
            this._alertService.showAlert(
              this._translocoService.translate(
                'alerts.password-reset-link-sent',
              ),
            );

            void this._router.navigateByUrl('/sign-in');
          }
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert(error.message);

          this._progressBarService.hideProgressBar();

          this.isResetPasswordPending = false;
        });
    }
  }
}
