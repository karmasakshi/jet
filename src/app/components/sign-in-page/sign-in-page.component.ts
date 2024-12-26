import { NgOptimizedImage, NgStyle } from '@angular/common';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
    NgStyle,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
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
  public isSignInPending: boolean;
  public isSignInWithOauthPending: boolean;
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

    this.isSignInPending = false;

    this.isSignInWithOauthPending = false;

    this.signInFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this._loggerService.logComponentInitialization('SignInPageComponent');
  }

  public ngOnInit(): void {
    this._bindQueryParamsManager.connect(this.signInFormGroup);
    this._getSession();
  }

  public ngOnDestroy(): void {
    this._bindQueryParamsManager.destroy();
  }

  public signIn(email: string, password: string): void {
    if (
      this.isSignInPending ||
      this.isGetSessionPending ||
      this.isSignInWithOauthPending ||
      this.signInFormGroup.invalid
    ) {
      return;
    }

    this.isSignInPending = true;
    this.signInFormGroup.disable();
    this._userService
      .signIn(email, password)
      .then(({ data, error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this.isSignInPending = false;
          this.signInFormGroup.enable();
        } else {
          if (data.session === null) {
            if (
              import.meta.env.NG_APP_SUPABASE_IS_CONFIRM_EMAIL_ON === 'true'
            ) {
              this._alertService.showAlert(
                this._translocoService.translate(
                  'alerts.email-confirmation-pending',
                ),
              );
              this.isSignInPending = false;
            } else {
              this._alertService.showErrorAlert();
              this.isSignInPending = false;
              this.signInFormGroup.enable();
            }
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
        this.isSignInPending = false;
        this.signInFormGroup.enable();
      });
  }

  public signInWithOauth(oauthProvider: AvailableOauthProvider): void {
    if (
      this.isSignInWithOauthPending ||
      this.isGetSessionPending ||
      this.isSignInPending
    ) {
      return;
    }

    this.isSignInWithOauthPending = true;
    this.signInFormGroup.disable();
    this._userService
      .signInWithOauth(oauthProvider)
      .then(({ data, error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this.isSignInWithOauthPending = false;
          this.signInFormGroup.enable();
        } else {
          window.location.href = data.url;
        }
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
        this._alertService.showErrorAlert(error.message);
        this.isSignInWithOauthPending = false;
        this.signInFormGroup.enable();
      });
  }

  private _getSession(): void {
    if (this.isGetSessionPending) {
      return;
    }

    this.isGetSessionPending = true;
    this.signInFormGroup.disable();
    this._progressBarService.showProgressBar({ mode: 'query' });
    this._userService
      .getSession()
      .then(({ data, error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this.isGetSessionPending = false;
          this.signInFormGroup.enable();
          this._progressBarService.hideProgressBar();
        } else {
          if (data.session === null) {
            this.isGetSessionPending = false;
            this.signInFormGroup.enable();
            this._progressBarService.hideProgressBar();
          } else {
            this._alertService.showAlert(
              this._translocoService.translate('alerts.welcome'),
            );
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
        this.isGetSessionPending = false;
        this.signInFormGroup.enable();
        this._progressBarService.hideProgressBar();
      });
  }
}
