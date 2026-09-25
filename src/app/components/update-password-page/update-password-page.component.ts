import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
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
import { closeFillIcon } from '@jet/svgs/close-fill';
import { visibilityFillIcon } from '@jet/svgs/visibility-fill';
import { visibilityOffFillIcon } from '@jet/svgs/visibility_off-fill';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';
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
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-update-password-page',
  styles: ``,
  templateUrl: './update-password-page.component.html',
})
export class UpdatePasswordPageComponent implements CanComponentDeactivate, OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);

  #isLoading: boolean;
  readonly #user: Signal<null | User>;

  protected isNewPasswordConfirmationHidden: boolean;
  protected isNewPasswordHidden: boolean;
  protected readonly updatePasswordFormGroup: FormGroup<{
    email: FormControl<null | string>;
    newPassword: FormControl<null | string>;
    newPasswordConfirmation: FormControl<null | string>;
  }>;

  public constructor() {
    addSvgIconLiteral([closeFillIcon, visibilityFillIcon, visibilityOffFillIcon]);

    this.#isLoading = false;

    this.#user = this.#userService.user;

    this.isNewPasswordConfirmationHidden = true;

    this.isNewPasswordHidden = true;

    this.updatePasswordFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null),
      newPassword: this.#formBuilder.control<null | string>(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
      newPasswordConfirmation: this.#formBuilder.control<null | string>(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
    });

    this.#loggerService.logComponentInitialization('UpdatePasswordPageComponent');
  }

  public ngOnInit(): void {
    this.updatePasswordFormGroup.patchValue({ email: this.#user()?.email ?? null });

    this.updatePasswordFormGroup.controls.newPasswordConfirmation.addValidators(
      this.#matchFormControlValidator(this.updatePasswordFormGroup.controls.newPassword),
    );

    this.updatePasswordFormGroup.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.updatePasswordFormGroup.controls.newPasswordConfirmation.updateValueAndValidity();
      });
  }

  public hasUnsavedChanges(): boolean {
    return this.updatePasswordFormGroup.dirty;
  }

  protected async updatePassword(password: string): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.updatePasswordFormGroup.disable();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      await this.#userService.updateUser({ password });

      this.updatePasswordFormGroup.markAsPristine();

      this.#alertService.showAlert(translate('alerts.password-updated'));

      void this.#router.navigateByUrl('/profile');
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.updatePasswordFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  #matchFormControlValidator(newPasswordControl: AbstractControl): ValidatorFn {
    return (newPasswordConfirmationControl: AbstractControl): null | ValidationErrors => {
      if (!newPasswordConfirmationControl.value) {
        return null;
      }

      return newPasswordConfirmationControl.value === newPasswordControl.value
        ? null
        : { mismatch: true };
    };
  }
}
