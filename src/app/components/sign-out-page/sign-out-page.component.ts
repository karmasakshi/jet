import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-sign-out-page',
  styleUrl: './sign-out-page.component.scss',
  templateUrl: './sign-out-page.component.html',
})
export class SignOutPageComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _translocoService = inject(TranslocoService);

  private _isSignOutPending: boolean;

  public constructor() {
    this._isSignOutPending = false;

    this._loggerService.logComponentInitialization('SignOutPageComponent');
  }

  public ngOnInit(): void {
    this._signOut();
  }

  private _signOut(): void {
    if (this._isSignOutPending) {
      return;
    }

    this._isSignOutPending = true;
    this._progressBarService.showProgressBar();
    this._authenticationService
      .signOut()
      .then(({ error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this._isSignOutPending = false;
          this._progressBarService.hideProgressBar();
        } else {
          this._alertService.showAlert(
            this._translocoService.translate('alerts.signed-out-successfully'),
          );

          void this._router.navigateByUrl('/');
        }
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
        this._alertService.showErrorAlert(error.message);
        this._isSignOutPending = false;
        this._progressBarService.hideProgressBar();
      });
  }
}
