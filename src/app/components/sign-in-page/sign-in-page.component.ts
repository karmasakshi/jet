import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
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
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-sign-in-page',
  styleUrl: './sign-in-page.component.scss',
  templateUrl: './sign-in-page.component.html',
})
export class SignInPageComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);
  readonly #translocoService = inject(TranslocoService);

  public readonly returnUrl: Signal<string | undefined> = input();

  #isLoading: boolean;

  public isPasswordHidden: boolean;
  public readonly signInFormGroup: FormGroup<{
    email: FormControl<null | string>;
    password: FormControl<null | string>;
  }>;

  public constructor() {
    this.#isLoading = false;

    this.isPasswordHidden = true;

    this.signInFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: this.#formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.#loggerService.logComponentInitialization('SignInPageComponent');
  }

  public ngOnInit(): void {
    void this.#getClaims();
  }

  public async signInWithPassword(email: string, password: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.signInFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data, error } = await this.#userService.signInWithPassword(
        email,
        password,
      );

      if (error) {
        throw error;
      }

      if (data.session === null) {
        throw new Error();
      }

      this.#alertService.showAlert(
        this.#translocoService.translate('alerts.welcome'),
      );

      void this.#router.navigateByUrl(this.returnUrl() ?? '/');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.signInFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  public async signInWithOauth(oauthProvider: AvailableOauthProvider) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.signInFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data, error } =
        await this.#userService.signInWithOauth(oauthProvider);

      if (error) {
        throw error;
      }

      window.location.href = data.url;
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.signInFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  public async signInWithOtp(email: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.signInFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { error } = await this.#userService.signInWithOtp(email);

      if (error) {
        throw error;
      }

      void this.#router.navigateByUrl('/sign-in-link-sent');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.signInFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  async #getClaims(): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.signInFormGroup.disable();
    this.#progressBarService.showQueryProgressBar();

    try {
      const { data, error } = await this.#userService.getClaims();

      if (error) {
        throw error;
      }

      if (data) {
        this.#alertService.showAlert(
          this.#translocoService.translate('alerts.welcome'),
        );

        void this.#router.navigateByUrl(this.returnUrl() ?? '/');
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.signInFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }
}
