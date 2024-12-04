import { Component, OnInit, inject } from '@angular/core';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { StorageService } from '@jet/services/storage/storage.service';
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
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _storageService = inject(StorageService);

  private _isLogoutPending: boolean;

  public constructor() {
    this._isLogoutPending = false;

    this._loggerService.logComponentInitialization('LogoutPageComponent');
  }

  public ngOnInit(): void {
    this._logout();
  }

  private _logout(): void {
    if (!this._isLogoutPending) {
      this._isLogoutPending = true;

      this._progressBarService.showProgressBar();

      this._authenticationService
        .logout()
        .then((): void => {
          this._storageService.clearSessionStorage();

          this._storageService.clearLocalStorage();

          this._progressBarService.hideProgressBar();

          this._isLogoutPending = false;
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert();

          this._progressBarService.hideProgressBar();

          this._isLogoutPending = false;
        });
    }
  }
}
