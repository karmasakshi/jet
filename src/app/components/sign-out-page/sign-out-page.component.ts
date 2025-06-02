import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Page } from '../page/page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, Page],
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

  private _isLoading: boolean;

  public constructor() {
    this._isLoading = false;

    this._loggerService.logComponentInitialization('SignOutPageComponent');
  }

  public ngOnInit(): void {
    void this._signOut();
  }

  private async _signOut(): Promise<void> {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this._progressBarService.showProgressBar();

    try {
      const { error } = await this._userService.signOut();

      if (error) {
        throw error;
      }

      this._alertService.showAlert(
        this._translocoService.translate('alerts.signed-out-successfully'),
      );

      void this._router.navigateByUrl('/');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this._progressBarService.hideProgressBar();
    }
  }
}
