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

  private _newPasswordFormControlSubscription: Subscription;

  public isConfirmNewPasswordHidden: boolean;
  public isNewPasswordHidden: boolean;
  public isUpdatePasswordPending: boolean;
  public readonly updatePasswordFormGroup: FormGroup<{
    confirmNewPassword: FormControl<string | null>;
    newPassword: FormControl<string | null>;
  }>;

  public constructor() {
    this._newPasswordFormControlSubscription = Subscription.EMPTY;

    this.isConfirmNewPasswordHidden = true;

    this.isNewPasswordHidden = true;

    this.isUpdatePasswordPending = false;

    this.updatePasswordFormGroup = this._formBuilder.group({
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this._loggerService.logComponentInitialization(
      'UpdatePasswordPageComponent',
    );
  }

  public ngOnInit(): void {
    this.updatePasswordFormGroup.controls.confirmNewPassword.addValidators(
      this._matchFormControlValidator(
        this.updatePasswordFormGroup.controls.newPassword,
      ),
    );

    this._newPasswordFormControlSubscription =
      this.updatePasswordFormGroup.controls.newPassword.valueChanges.subscribe(
        () => {
          this.updatePasswordFormGroup.controls.confirmNewPassword.updateValueAndValidity();
        },
      );
  }

  public ngOnDestroy(): void {
    this._newPasswordFormControlSubscription.unsubscribe();
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
    } catch (exception: unknown) {
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

  private _matchFormControlValidator(
    newPasswordControl: AbstractControl,
  ): ValidatorFn {
    return (
      confirmNewPasswordControl: AbstractControl,
    ): ValidationErrors | null => {
      if (!confirmNewPasswordControl.value) {
        return null;
      }

      return confirmNewPasswordControl.value === newPasswordControl.value
        ? null
        : { mismatch: true };
    };
  }
}
