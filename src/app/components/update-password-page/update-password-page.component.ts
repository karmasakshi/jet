import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
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
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-update-password-page',
  styleUrl: './update-password-page.component.scss',
  templateUrl: './update-password-page.component.html',
})
export class UpdatePasswordPageComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private _passwordFormControlSubscription: Subscription;

  public isConfirmPasswordHidden: boolean;
  public isPasswordHidden: boolean;
  public isUpdatePasswordPending: boolean;
  public readonly updatePasswordFormGroup: FormGroup<{
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  public constructor() {
    this._passwordFormControlSubscription = Subscription.EMPTY;

    this.isConfirmPasswordHidden = true;

    this.isPasswordHidden = true;

    this.isUpdatePasswordPending = false;

    this.updatePasswordFormGroup = this._formBuilder.group({
      confirmPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this._loggerService.logComponentInitialization(
      'UpdatePasswordPageComponent',
    );
  }

  public ngOnInit(): void {
    this.updatePasswordFormGroup.controls.confirmPassword.addValidators(
      this._confirmPasswordValidator(
        this.updatePasswordFormGroup.controls.password,
      ),
    );

    this._passwordFormControlSubscription =
      this.updatePasswordFormGroup.controls.password.valueChanges.subscribe(
        () => {
          this.updatePasswordFormGroup.controls.confirmPassword.updateValueAndValidity();
        },
      );
  }

  public ngOnDestroy(): void {
    this._passwordFormControlSubscription.unsubscribe();
  }

  public async updatePassword(password: string): Promise<void> {
    if (this.isUpdatePasswordPending || this.updatePasswordFormGroup.invalid) {
      return;
    }

    this.isUpdatePasswordPending = true;
    this.updatePasswordFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { error } = await this._userService.updateUser({ password });

      if (error) {
        throw error;
      }

      this._alertService.showAlert(
        this._translocoService.translate('alerts.password-updated'),
      );
      void this._router.navigateByUrl('/profile');
    } catch (exception) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }

      this.updatePasswordFormGroup.enable();
    } finally {
      this.isUpdatePasswordPending = false;
      this._progressBarService.hideProgressBar();
    }
  }

  private _confirmPasswordValidator(
    passwordControl: AbstractControl,
  ): ValidatorFn {
    return (
      confirmPasswordControl: AbstractControl,
    ): ValidationErrors | null => {
      if (!confirmPasswordControl.value) {
        return null;
      }

      return confirmPasswordControl.value === passwordControl.value
        ? null
        : { confirmPasswordMismatch: true };
    };
  }
}
