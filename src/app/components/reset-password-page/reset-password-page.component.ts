import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { TranslocoModule } from '@jsverse/transloco';
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
  selector: 'jet-reset-password-page',
  styleUrl: './reset-password-page.component.scss',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent {
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);

  #isLoading: boolean;

  public readonly resetPasswordFormGroup: FormGroup<{
    email: FormControl<null | string>;
  }>;

  public constructor() {
    this.#isLoading = false;

    this.resetPasswordFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.email,
      ]),
    });

    this.#loggerService.logComponentInitialization(
      'ResetPasswordPageComponent',
    );
  }

  public async resetPasswordForEmail(email: string) {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.resetPasswordFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { error } = await this.#userService.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      void this.#router.navigateByUrl('/reset-password-email-sent');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.resetPasswordFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }
}
