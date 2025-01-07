import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
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
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private _isSignOutPending: boolean;

  public constructor() {
    this._isSignOutPending = false;

    this._loggerService.logComponentInitialization('SignOutPageComponent');
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  public async ngOnInit(): Promise<void> {
    const returnUrl: string | null = await this._signOut();

    if (returnUrl) {
      void this._router.navigateByUrl(returnUrl);
    }
  }

  private async _signOut(): Promise<string | null> {
    if (this._isSignOutPending) {
      return null;
    }

    this._isSignOutPending = true;
    this._progressBarService.showProgressBar();

    try {
      const { error } = await this._userService.signOut();

      if (error) {
        throw error;
      }

      this._alertService.showAlert(
        this._translocoService.translate('alerts.signed-out-successfully'),
      );

      return '/';
    } catch (exception) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }

      return null;
    } finally {
      this._isSignOutPending = false;
      this._progressBarService.hideProgressBar();
    }
  }
}
