import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { StorageService } from '@jet/services/storage/storage.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-sign-out-page',
  standalone: true,
  styleUrl: './sign-out-page.component.scss',
  templateUrl: './sign-out-page.component.html',
})
export class SignOutPageComponent implements OnInit {
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _storageService = inject(StorageService);

  private _isSignOutPending: boolean;

  public constructor() {
    this._isSignOutPending = false;

    this._loggerService.logComponentInitialization('SignOutPageComponent');
  }

  public ngOnInit(): void {
    this._signOut();
  }

  private _signOut(): void {
    if (!this._isSignOutPending) {
      this._isSignOutPending = true;

      this._progressBarService.showProgressBar();

      this._authenticationService
        .signOut()
        .then((): void => {
          this._storageService.clearSessionStorage();

          this._storageService.clearLocalStorage();

          this._progressBarService.hideProgressBar();

          this._isSignOutPending = false;
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert();

          this._progressBarService.hideProgressBar();

          this._isSignOutPending = false;
        });
    }
  }
}
