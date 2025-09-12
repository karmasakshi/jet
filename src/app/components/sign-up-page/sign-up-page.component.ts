import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
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
  selector: 'jet-sign-up-page',
  styleUrl: './sign-up-page.component.scss',
  templateUrl: './sign-up-page.component.html',
})
export class SignUpPageComponent implements OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);
  readonly #translocoService = inject(TranslocoService);

  public readonly email: InputSignal<string | undefined> = input();

  #isLoading: boolean;

  public isPasswordHidden: boolean;
  public readonly signUpFormGroup: FormGroup<{
    email: FormControl<null | string>;
    password: FormControl<null | string>;
  }>;

  public constructor() {
    this.#isLoading = false;

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
    });

    this.#loggerService.logComponentInitialization('SignUpPageComponent');
  }

  public ngOnInit(): void {
    this.signUpFormGroup.patchValue({ email: this.email() ?? null });
  }

  public async signUp(email: string, password: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.signUpFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data, error } = await this.#userService.signUp(email, password);

      if (error) {
        throw error;
      }

      if (data.session === null) {
        void this.#router.navigateByUrl('/email-verification-pending');
      } else {
        this.#alertService.showAlert(
          this.#translocoService.translate('alerts.welcome'),
        );

        void this.#router.navigateByUrl('/');
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
      this.signUpFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }
}
