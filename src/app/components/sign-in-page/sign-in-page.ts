import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Page } from '../page/page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    TranslocoModule,
    Page,
  ],
  selector: 'jet-sign-in-page',
  styleUrl: './sign-in-page.scss',
  templateUrl: './sign-in-page.html',
})
export class SignInPage implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  public readonly returnUrl: Signal<undefined | string> = input();

  private _isLoading: boolean;

  public isPasswordHidden: boolean;
  public readonly signInFormGroup: FormGroup<{
    email: FormControl<null | string>;
    password: FormControl<null | string>;
  }>;

  public constructor() {
    this._isLoading = false;

    this.isPasswordHidden = true;

    this.signInFormGroup = this._formBuilder.group({
      email: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this._loggerService.logComponentInitialization('SignInPage');
  }

  public ngOnInit(): void {
    void this._getSession();
  }

  public async signInWithPassword(email: string, password: string) {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { data, error } = await this._userService.signInWithPassword(
        email,
        password,
      );

      if (error) {
        throw error;
      }

      if (data.session === null) {
        throw new Error();
      }

      this._alertService.showAlert(
        this._translocoService.translate('alerts.welcome'),
      );

      void this._router.navigateByUrl(this.returnUrl() ?? '/');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.signInFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  public async signInWithOauth(oauthProvider: AvailableOauthProvider) {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { data, error } =
        await this._userService.signInWithOauth(oauthProvider);

      if (error) {
        throw error;
      }

      window.location.href = data.url;
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.signInFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  public async signInWithOtp(email: string) {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { error } = await this._userService.signInWithOtp(email);

      if (error) {
        throw error;
      }

      void this._router.navigateByUrl('/sign-in-link-sent');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.signInFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  private async _getSession(): Promise<void> {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar({ mode: 'query' });

    try {
      const { data, error } = await this._userService.getSession();

      if (error) {
        throw error;
      }

      if (data.session) {
        this._alertService.showAlert(
          this._translocoService.translate('alerts.welcome'),
        );

        void this._router.navigateByUrl(this.returnUrl() ?? '/');
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.signInFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }
}
