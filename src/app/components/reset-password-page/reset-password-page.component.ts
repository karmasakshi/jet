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
import { TranslocoModule } from '@jsverse/transloco';
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
  selector: 'jet-reset-password-page',
  styleUrl: './reset-password-page.component.scss',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
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

  public async resetPasswordForEmail(email: string) {
    if (this.isResetPasswordPending || this.resetPasswordFormGroup.invalid) {
      return;
    }

    this.isResetPasswordPending = true;
    this.resetPasswordFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { error } = await this._userService.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      void this._router.navigateByUrl('/reset-password-email-sent');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }

      this.resetPasswordFormGroup.enable();
    } finally {
      this.isResetPasswordPending = false;
      this._progressBarService.hideProgressBar();
    }
  }
}
