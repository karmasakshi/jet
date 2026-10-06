import { NgOptimizedImage } from '@angular/common';
import { Component, DOCUMENT, effect, inject, input, OnInit } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { closeFillIcon } from '@jet/svgs/close-fill';
import { visibilityFillIcon } from '@jet/svgs/visibility-fill';
import { visibilityOffFillIcon } from '@jet/svgs/visibility_off-fill';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { Provider } from '@supabase/supabase-js';
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
    MatTabsModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-sign-in-page',
  styles: ``,
  templateUrl: './sign-in-page.component.html',
})
export class SignInPageComponent implements OnInit {
  readonly #document = inject(DOCUMENT);
  readonly #formBuilder = inject(FormBuilder);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);

  #isLoading: boolean;

  public readonly email = input<null | string>(null);
  public readonly returnUrl = input<string>('/');

  protected isPasswordHidden: boolean;
  protected isPhoneOtpSent: boolean;
  protected readonly emailLinkFormGroup: FormGroup<{ email: FormControl<null | string> }>;
  protected readonly phoneSignInFormGroup: FormGroup<{
    otp: FormControl<null | string>;
    phone: FormControl<null | string>;
  }>;
  protected readonly signInFormGroup: FormGroup<{
    email: FormControl<null | string>;
    password: FormControl<null | string>;
  }>;

  public constructor() {
    addSvgIconLiteral([closeFillIcon, visibilityFillIcon, visibilityOffFillIcon]);

    this.#isLoading = false;

    this.isPasswordHidden = true;
    this.isPhoneOtpSent = false;

    this.emailLinkFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null, [
        Validators.email,
        Validators.required,
      ]),
    });

    this.phoneSignInFormGroup = this.#formBuilder.group({
      otp: this.#formBuilder.control<null | string>(null, [
        Validators.pattern(/^[0-9]{6}$/),
        Validators.required,
      ]),
      phone: this.#formBuilder.control<null | string>('+91', [
        Validators.pattern(/^\+[1-9][0-9]{7,14}$/),
        Validators.required,
      ]),
    });

    this.signInFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null, [
        Validators.email,
        Validators.required,
      ]),
      password: this.#formBuilder.control<null | string>(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
    });

    effect(
      () => {
        if (this.#userService.isSignedIn()) {
          void this.#redirectIfSignedIn();
        }
      },
      { debugName: 'isSignedIn' },
    );

    this.#loggerService.logComponentInitialization('SignInPageComponent');
  }

  public ngOnInit(): void {
    this.emailLinkFormGroup.patchValue({ email: this.email() });
    this.signInFormGroup.patchValue({ email: this.email() });

    void this.#showSupabaseAuthRedirectError(this.#activatedRoute.snapshot.fragment);
  }

  protected async signInWithPassword(email: string, password: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.#disableAuthForms();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data } = await this.#userService.signInWithPassword(email, password);

      if (data.session === null) {
        throw new Error();
      }
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.#enableAuthForms();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected async signInWithOauth(provider: Provider) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.#disableAuthForms();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data } = await this.#userService.signInWithOauth(provider, this.returnUrl());

      this.#document.location.href = data.url ?? '/';
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.#enableAuthForms();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected async sendEmailSignInLink(email: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.#disableAuthForms();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      await this.#userService.signInWithOtp({ email }, this.returnUrl());

      void this.#router.navigateByUrl('/sign-in-link-sent');
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.#enableAuthForms();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected async sendPhoneOtp(phone: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.#disableAuthForms();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      await this.#userService.signInWithOtp({ phone: this.#getSupabasePhone(phone) });

      this.isPhoneOtpSent = true;
      this.phoneSignInFormGroup.controls.otp.reset();
      this.#alertService.showAlert(translate('alerts.otp-sent'));
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.#enableAuthForms();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected async verifyOtp(phone: string, otp: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.#disableAuthForms();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data } = await this.#userService.verifyOtp({
        phone: this.#getSupabasePhone(phone),
        token: otp.trim(),
        type: 'sms',
      });

      if (data.session === null) {
        throw new Error();
      }
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.#enableAuthForms();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected resetPhoneOtp(): void {
    this.isPhoneOtpSent = false;
    this.phoneSignInFormGroup.controls.otp.reset();
  }

  async #redirectIfSignedIn(): Promise<void> {
    this.#alertService.showAlert(translate('alerts.welcome'));

    await this.#router.navigateByUrl(this.returnUrl());
  }

  async #showSupabaseAuthRedirectError(fragment: null | string): Promise<void> {
    if (fragment === null) {
      return;
    }

    const searchParams = new URLSearchParams(fragment);
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    if (error === null || errorCode === null) {
      return;
    }

    this.#alertService.showExceptionAlert(
      new Error(errorDescription ?? translate('alerts.something-went-wrong')),
    );

    await this.#router.navigate([], { queryParamsHandling: 'preserve', replaceUrl: true });
  }

  #disableAuthForms(): void {
    this.emailLinkFormGroup.disable();
    this.signInFormGroup.disable();
    this.phoneSignInFormGroup.disable();
  }

  #enableAuthForms(): void {
    this.emailLinkFormGroup.enable();
    this.signInFormGroup.enable();
    this.phoneSignInFormGroup.enable();
  }

  #getSupabasePhone(phone: string): string {
    const trimmedPhone = phone.trim();

    if (trimmedPhone.startsWith('+')) {
      return trimmedPhone;
    }

    if (trimmedPhone.startsWith('91') && trimmedPhone.length === 12) {
      return `+${trimmedPhone}`;
    }

    if (trimmedPhone.startsWith('0')) {
      return `+91${trimmedPhone.slice(1)}`;
    }

    return `+91${trimmedPhone}`;
  }
}
