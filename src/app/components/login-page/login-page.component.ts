import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { User } from '@jet/interfaces/user.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [MatButtonModule, TranslocoModule, PageComponent],
  selector: 'jet-login-page',
  standalone: true,
  styleUrl: './login-page.component.scss',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _translocoService = inject(TranslocoService);

  public isGetUserPending: boolean;
  public isLoginPending: boolean;

  public constructor() {
    this.isGetUserPending = false;

    this.isLoginPending = false;

    this._loggerService.logComponentInitialization('LoginPageComponent');
  }

  public ngOnInit(): void {
    this._getUser();
  }

  public login(): void {
    if (!this.isLoginPending) {
      this.isLoginPending = true;
      this._progressBarService.showProgressBar();
      this._authenticationService
        .login()
        .then((): void => {
          const returnUrl =
            this._activatedRoute.snapshot.queryParamMap.get(
              QueryParam.ReturnUrl,
            ) ?? '/';
          this._progressBarService.hideProgressBar();
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

  private _getUser(): void {
    if (!this.isGetUserPending) {
      this.isGetUserPending = true;
      this._progressBarService.showProgressBar({ mode: 'query' });
      this._authenticationService
        .getUser()
        .then((user: User | null): void => {
          this._progressBarService.hideProgressBar();
          if (user !== null) {
            this._alertService.showAlert(
              this._translocoService.translate('alerts.welcome'),
            );
            const returnUrl =
              this._activatedRoute.snapshot.queryParamMap.get(
                QueryParam.ReturnUrl,
              ) ?? '/';
            void this._router.navigateByUrl(returnUrl);
          } else {
            this.isGetUserPending = false;
          }
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this._progressBarService.hideProgressBar();
          this.isGetUserPending = false;
        });
    }
  }
}
