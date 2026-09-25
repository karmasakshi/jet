import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { closeFillIcon } from '@jet/svgs/close-fill';
import { visibilityFillIcon } from '@jet/svgs/visibility-fill';
import { visibilityOffFillIcon } from '@jet/svgs/visibility_off-fill';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { translate, TranslocoModule } from '@jsverse/transloco';
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
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-sign-up-page',
  styles: ``,
  templateUrl: './sign-up-page.component.html',
})
export class SignUpPageComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);

  #isLoading: boolean;

  public readonly email = input<null | string>(null);
  public readonly returnUrl = input<string>('/');

  protected isPasswordConfirmationHidden: boolean;
  protected isPasswordHidden: boolean;
  protected readonly signUpFormGroup: FormGroup<{
    email: FormControl<null | string>;
    password: FormControl<null | string>;
    passwordConfirmation: FormControl<null | string>;
  }>;

  public constructor() {
    addSvgIconLiteral([closeFillIcon, visibilityFillIcon, visibilityOffFillIcon]);

    this.#isLoading = false;

    this.isPasswordConfirmationHidden = true;

    this.isPasswordHidden = true;

    this.signUpFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null, [
        Validators.email,
        Validators.required,
      ]),
      password: this.#formBuilder.control<null | string>(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
      passwordConfirmation: this.#formBuilder.control<null | string>(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
    });

    this.#loggerService.logComponentInitialization('SignUpPageComponent');
  }

  public ngOnInit(): void {
    this.signUpFormGroup.patchValue({ email: this.email() });

    this.signUpFormGroup.controls.passwordConfirmation.addValidators(
      this.#matchFormControlValidator(this.signUpFormGroup.controls.password),
    );

    this.signUpFormGroup.controls.password.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.signUpFormGroup.controls.passwordConfirmation.updateValueAndValidity();
      });
  }

  protected async signUp(email: string, password: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.signUpFormGroup.disable();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data } = await this.#userService.signUp(email, password, this.returnUrl());

      if (data.session === null) {
        void this.#router.navigateByUrl('/email-verification-pending');
      } else {
        this.#alertService.showAlert(translate('alerts.welcome'));

        void this.#router.navigateByUrl(this.returnUrl());
      }
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.signUpFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  #matchFormControlValidator(passwordControl: AbstractControl): ValidatorFn {
    return (passwordConfirmationControl: AbstractControl): null | ValidationErrors => {
      if (!passwordConfirmationControl.value) {
        return null;
      }

      return passwordConfirmationControl.value === passwordControl.value
        ? null
        : { mismatch: true };
    };
  }
}
