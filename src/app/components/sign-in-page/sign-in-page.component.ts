import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  BindQueryParamsFactory,
  BindQueryParamsManager,
} from '@ngneat/bind-query-params';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-sign-in-page',
  styleUrl: './sign-in-page.component.scss',
  templateUrl: './sign-in-page.component.html',
})
export class SignInPageComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _bindQueryParamsFactory = inject(BindQueryParamsFactory);

  private readonly _bindQueryParamsManager: BindQueryParamsManager<{
    email: string;
  }>;

  public isGetSessionPending: boolean;
  public isPasswordHidden: boolean;
  public isSignInWithOauthPending: boolean;
  public isSignInWithOtpPending: boolean;
  public isSignInWithPasswordPending: boolean;
  public readonly signInFormGroup: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  public constructor() {
    this._bindQueryParamsManager = this._bindQueryParamsFactory.create([
      { queryKey: 'email', type: 'string' },
    ]);

    this.isGetSessionPending = false;

    this.isPasswordHidden = true;

    this.isSignInWithOauthPending = false;

    this.isSignInWithOtpPending = false;

    this.isSignInWithPasswordPending = false;

    this.signInFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this._loggerService.logComponentInitialization('SignInPageComponent');
  }

  public ngOnInit(): void {
    void this._getSession();
    this._bindQueryParamsManager.connect(this.signInFormGroup);
  }

  public ngOnDestroy(): void {
    this._bindQueryParamsManager.destroy();
  }

  public signInWithPassword(email: string, password: string): void {
    if (
      this.isGetSessionPending ||
      this.isSignInWithOauthPending ||
      this.isSignInWithOtpPending ||
      this.isSignInWithPasswordPending ||
      this.signInFormGroup.invalid
    ) {
      return;
    }

    this.isSignInWithPasswordPending = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar();
    this._userService
      .signInWithPassword(email, password)
      .then(({ data, error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this.isSignInWithPasswordPending = false;
          this.signInFormGroup.enable();
          this._progressBarService.hideProgressBar();
        } else {
          if (data.session === null) {
            this._alertService.showErrorAlert();
            this.isSignInWithPasswordPending = false;
            this.signInFormGroup.enable();
            this._progressBarService.hideProgressBar();
          } else {
            this._alertService.showAlert(
              this._translocoService.translate('alerts.welcome'),
            );
            this._progressBarService.hideProgressBar();
            const returnUrl =
              this._activatedRoute.snapshot.queryParamMap.get(
                QueryParam.ReturnUrl,
              ) ?? '/';
            setTimeout(() => {
              void this._router.navigateByUrl(returnUrl);
            });
          }
        }
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
        this._alertService.showErrorAlert(error.message);
        this.isSignInWithPasswordPending = false;
        this.signInFormGroup.enable();
        this._progressBarService.hideProgressBar();
      });
  }

  public async signInWithOauth(oauthProvider: AvailableOauthProvider) {
    if (
      this.isGetSessionPending ||
      this.isSignInWithOauthPending ||
      this.isSignInWithOtpPending ||
      this.isSignInWithPasswordPending
    ) {
      return;
    }

    this.isSignInWithOauthPending = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { data, error } =
        await this._userService.signInWithOauth(oauthProvider);

      if (error) {
        throw error;
      }

      window.location.href = data.url;
    } catch (exception) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }

      this.signInFormGroup.enable();
    } finally {
      this.isSignInWithOauthPending = false;
      this._progressBarService.hideProgressBar();
    }
  }

  public async signInWithOtp(email: string) {
    if (
      this.isGetSessionPending ||
      this.isSignInWithOauthPending ||
      this.isSignInWithOtpPending ||
      this.isSignInWithPasswordPending ||
      this.signInFormGroup.controls.email.invalid
    ) {
      return;
    }

    this.isSignInWithOtpPending = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { error } = await this._userService.signInWithOtp(email);

      if (error) {
        throw error;
      }

      void this._router.navigateByUrl('/sign-in-link-sent');
    } catch (exception) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }

      this.signInFormGroup.enable();
    } finally {
      this.isSignInWithOtpPending = false;
      this._progressBarService.hideProgressBar();
    }
  }

  private async _getSession() {
    if (this.isGetSessionPending) {
      return;
    }

    this.isGetSessionPending = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar({ mode: 'query' });

    try {
      const { data, error } = await this._userService.getSession();

      if (error) {
        throw error;
      }

      if (data.session !== null) {
        this._alertService.showAlert(
          this._translocoService.translate('alerts.welcome'),
        );
        this.signInFormGroup.reset();
        const returnUrl =
          this._activatedRoute.snapshot.queryParamMap.get(
            QueryParam.ReturnUrl,
          ) ?? '/';
        setTimeout(() => {
          void this._router.navigateByUrl(returnUrl);
        });
      }
    } catch (exception) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this.isGetSessionPending = false;
      this.signInFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }
}
