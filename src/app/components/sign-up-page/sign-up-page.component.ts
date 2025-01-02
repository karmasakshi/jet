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
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
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
  selector: 'jet-sign-up-page',
  styleUrl: './sign-up-page.component.scss',
  templateUrl: './sign-up-page.component.html',
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
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

  public isPasswordHidden: boolean;
  public isSignUpPending: boolean;
  public readonly signUpFormGroup: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  public constructor() {
    this._bindQueryParamsManager = this._bindQueryParamsFactory.create([
      { queryKey: 'email', type: 'string' },
    ]);

    this.isPasswordHidden = true;

    this.isSignUpPending = false;

    this.signUpFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this._loggerService.logComponentInitialization('SignUpPageComponent');
  }

  public ngOnInit(): void {
    this._bindQueryParamsManager.connect(this.signUpFormGroup);
  }

  public ngOnDestroy(): void {
    this._bindQueryParamsManager.destroy();
  }

  public signUp(email: string, password: string): void {
    if (this.isSignUpPending || this.signUpFormGroup.invalid) {
      return;
    }

    this.isSignUpPending = true;
    this.signUpFormGroup.disable();
    this._progressBarService.showProgressBar();
    this._userService
      .signUp(email, password)
      .then(({ data, error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this.isSignUpPending = false;
          this.signUpFormGroup.enable();
          this._progressBarService.hideProgressBar();
        } else {
          if (data.session === null) {
            if (
              import.meta.env.NG_APP_SUPABASE_IS_CONFIRM_EMAIL_ON === 'true'
            ) {
              this._progressBarService.hideProgressBar();
              void this._router.navigateByUrl('/email-verification-pending');
            } else {
              this._alertService.showErrorAlert();
              this.isSignUpPending = false;
              this.signUpFormGroup.enable();
              this._progressBarService.hideProgressBar();
            }
          } else {
            this._alertService.showAlert(
              this._translocoService.translate('alerts.welcome'),
            );
            this._progressBarService.hideProgressBar();
            void this._router.navigateByUrl('/');
          }
        }
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
        this._alertService.showErrorAlert(error.message);
        this.isSignUpPending = false;
        this.signUpFormGroup.enable();
        this._progressBarService.hideProgressBar();
      });
  }
}
