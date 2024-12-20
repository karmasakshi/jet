import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { AvailableOauthProviders } from '@jet/types/available-oauth-providers.type';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-sign-in-page',
  styleUrl: './sign-in-page.component.scss',
  templateUrl: './sign-in-page.component.html',
})
export class SignInPageComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _translocoService = inject(TranslocoService);

  public isGetUserPending: boolean;
  public isSignInWithEmailAndPasswordPending: boolean;
  public isSignInWithOauthPending: boolean;
  public signInFormGroup: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  public constructor() {
    this.isGetUserPending = false;

    this.isSignInWithEmailAndPasswordPending = false;

    this.isSignInWithOauthPending = false;

    this.signInFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this._loggerService.logComponentInitialization('SignInPageComponent');
  }

  public ngOnInit(): void {
    this._getUser();
  }

  public signInWithEmailAndPassword(email: string, password: string): void {
    if (
      !this.isSignInWithEmailAndPasswordPending &&
      !this.isGetUserPending &&
      !this.isSignInWithOauthPending &&
      this.signInFormGroup.valid
    ) {
      this.isSignInWithEmailAndPasswordPending = true;

      this.signInFormGroup.disable();

      this._authenticationService
        .signInWithEmailAndPassword(email, password)
        .then(({ data, error }): void => {
          if (error) {
            this._loggerService.logError(error);

            this._alertService.showErrorAlert(error.message);

            this.isSignInWithEmailAndPasswordPending = false;

            this.signInFormGroup.enable();
          } else {
            if (data.user === null) {
              this._alertService.showErrorAlert();

              this.isSignInWithEmailAndPasswordPending = false;

              this.signInFormGroup.enable();
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

          this.isSignInWithEmailAndPasswordPending = false;

          this.signInFormGroup.enable();
        });
    }
  }

  public signInWithOauth(oauthProvider: AvailableOauthProviders): void {
    if (
      !this.isSignInWithOauthPending &&
      !this.isGetUserPending &&
      !this.isSignInWithEmailAndPasswordPending
    ) {
      this.isSignInWithOauthPending = true;

      this.signInFormGroup.disable();

      this._progressBarService.showProgressBar();

      this._authenticationService
        .signInWithOauth(oauthProvider)
        .then(({ error }): void => {
          if (error) {
            this._loggerService.logError(error);

            this._alertService.showErrorAlert(error.message);

            this.isSignInWithOauthPending = false;

            this.signInFormGroup.enable();

            this._progressBarService.hideProgressBar();
          } else {
            this.isSignInWithOauthPending = false;

            this.signInFormGroup.enable();

            this._progressBarService.hideProgressBar();
          }
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert(error.message);

          this.isSignInWithOauthPending = false;

          this.signInFormGroup.enable();

          this._progressBarService.hideProgressBar();
        });
    }
  }

  private _getUser(): void {
    if (!this.isGetUserPending) {
      this.isGetUserPending = true;

      this.signInFormGroup.disable();

      this._progressBarService.showProgressBar({ mode: 'query' });

      this._authenticationService
        .getUser()
        .then(({ data, error }): void => {
          if (error) {
            this._loggerService.logError(error);

            // this._alertService.showErrorAlert(error.message);

            this.isGetUserPending = false;

            this.signInFormGroup.enable();

            this._progressBarService.hideProgressBar();
          } else {
            if (data.user === null) {
              this.isGetUserPending = false;

              this.signInFormGroup.enable();

              this._progressBarService.hideProgressBar();
            } else {
              const returnUrl =
                this._activatedRoute.snapshot.queryParamMap.get(
                  QueryParam.ReturnUrl,
                ) ?? '/';

              this._progressBarService.hideProgressBar();

              void this._router.navigateByUrl(returnUrl);
            }
          }
        })
        .catch((error: Error): void => {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert(error.message);

          this.isGetUserPending = false;

          this.signInFormGroup.enable();

          this._progressBarService.hideProgressBar();
        });
    }
  }
}
