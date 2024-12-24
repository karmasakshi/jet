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
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { LoggerService } from '@jet/services/logger/logger.service';
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
  selector: 'jet-reset-password-page',
  styleUrl: './reset-password-page.component.scss',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _bindQueryParamsFactory = inject(BindQueryParamsFactory);

  private readonly _bindQueryParamsManager: BindQueryParamsManager<{
    email: string;
  }>;

  public isResetPasswordPending: boolean;
  public readonly resetPasswordFormGroup: FormGroup<{
    email: FormControl<string | null>;
  }>;

  public constructor() {
    this._bindQueryParamsManager = this._bindQueryParamsFactory.create([
      { queryKey: 'email', type: 'string' },
    ]);

    this.isResetPasswordPending = false;

    this.resetPasswordFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this._loggerService.logComponentInitialization(
      'ResetPasswordPageComponent',
    );
  }

  public ngOnInit(): void {
    this._bindQueryParamsManager.connect(this.resetPasswordFormGroup);
  }

  public ngOnDestroy(): void {
    this._bindQueryParamsManager.destroy();
  }

  public resetPassword(email: string): void {
    if (this.isResetPasswordPending || this.resetPasswordFormGroup.invalid) {
      return;
    }

    this.isResetPasswordPending = true;
    this.resetPasswordFormGroup.disable();
    this._authenticationService
      .resetPassword(email)
      .then(({ error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
          this.isResetPasswordPending = false;
          this.resetPasswordFormGroup.enable();
        } else {
          this._alertService.showAlert(
            this._translocoService.translate('alerts.well-send-an-email'),
          );
          void this._router.navigateByUrl('/sign-in');
        }
      })
      .catch((error: Error): void => {
        this._loggerService.logError(error);
        this._alertService.showErrorAlert(error.message);
        this.isResetPasswordPending = false;
        this.resetPasswordFormGroup.enable();
      });
  }
}
