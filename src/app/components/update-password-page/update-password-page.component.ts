import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

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
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-update-password-page',
  styleUrl: './update-password-page.component.scss',
  templateUrl: './update-password-page.component.html',
})
export class UpdatePasswordPageComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private _isLoading: boolean;

  public isConfirmNewPasswordHidden: boolean;
  public isNewPasswordHidden: boolean;
  public readonly updatePasswordFormGroup: FormGroup<{
    confirmNewPassword: FormControl<null | string>;
    newPassword: FormControl<null | string>;
  }>;

  public constructor() {
    this._isLoading = false;

    this.isConfirmNewPasswordHidden = true;

    this.isNewPasswordHidden = true;

    this.updatePasswordFormGroup = this._formBuilder.group({
      confirmNewPassword: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassword: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
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

    this.updatePasswordFormGroup.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.updatePasswordFormGroup.controls.confirmNewPassword.updateValueAndValidity();
      });
  }

  public async updatePassword(password: string): Promise<void> {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.updatePasswordFormGroup.disable();
    this._progressBarService.showIndeterminateProgressBar();

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
    } finally {
      this._isLoading = false;
      this.updatePasswordFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  private _matchFormControlValidator(
    newPasswordControl: AbstractControl,
  ): ValidatorFn {
    return (
      confirmNewPasswordControl: AbstractControl,
    ): null | ValidationErrors => {
      if (!confirmNewPasswordControl.value) {
        return null;
      }

      return confirmNewPasswordControl.value === newPasswordControl.value
        ? null
        : { mismatch: true };
    };
  }
}
