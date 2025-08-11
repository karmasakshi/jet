import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
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
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';
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
export class UpdatePasswordPageComponent
  implements CanComponentDeactivate, OnInit
{
  readonly #destroyRef = inject(DestroyRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);
  readonly #translocoService = inject(TranslocoService);

  #isLoading: boolean;
  readonly #user: Signal<null | User>;

  public isConfirmNewPasswordHidden: boolean;
  public isNewPasswordHidden: boolean;
  public readonly updatePasswordFormGroup: FormGroup<{
    confirmNewPassword: FormControl<null | string>;
    email: FormControl<null | string>;
    newPassword: FormControl<null | string>;
  }>;

  public constructor() {
    this.#isLoading = false;

    this.#user = this.#userService.user;

    this.isConfirmNewPasswordHidden = true;

    this.isNewPasswordHidden = true;

    this.updatePasswordFormGroup = this.#formBuilder.group({
      confirmNewPassword: this.#formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      email: this.#formBuilder.control<null | string>({
        disabled: true,
        value: null,
      }),
      newPassword: this.#formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.#loggerService.logComponentInitialization(
      'UpdatePasswordPageComponent',
    );
  }

  public ngOnInit(): void {
    this.updatePasswordFormGroup.controls.confirmNewPassword.addValidators(
      this.#matchFormControlValidator(
        this.updatePasswordFormGroup.controls.newPassword,
      ),
    );

    this.updatePasswordFormGroup.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.updatePasswordFormGroup.controls.confirmNewPassword.updateValueAndValidity();
      });

    this.updatePasswordFormGroup.patchValue({
      email: this.#user()?.email ?? null,
    });
  }

  public hasUnsavedChanges(): boolean {
    return this.updatePasswordFormGroup.dirty;
  }

  public async updatePassword(password: string): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.updatePasswordFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { error } = await this.#userService.updateUser({ password });

      if (error) {
        throw error;
      }

      this.updatePasswordFormGroup.markAsPristine();

      this.#alertService.showAlert(
        this.#translocoService.translate('alerts.password-updated'),
      );

      void this.#router.navigateByUrl('/profile');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.updatePasswordFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  #matchFormControlValidator(newPasswordControl: AbstractControl): ValidatorFn {
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
