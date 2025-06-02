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
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Page } from '../page/page';

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
    Page,
  ],
  selector: 'jet-sign-up-page',
  styleUrl: './sign-up-page.scss',
  templateUrl: './sign-up-page.html',
})
export class SignUpPage {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private _isLoading: boolean;

  public isPasswordHidden: boolean;
  public readonly signUpFormGroup: FormGroup<{
    email: FormControl<null | string>;
    password: FormControl<null | string>;
  }>;

  public constructor() {
    this._isLoading = false;

    this.isPasswordHidden = true;

    this.signUpFormGroup = this._formBuilder.group({
      email: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this._loggerService.logComponentInitialization('SignUpPage');
  }

  public async signUp(email: string, password: string) {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.signUpFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      const { data, error } = await this._userService.signUp(email, password);

      if (error) {
        throw error;
      }

      if (data.session === null) {
        void this._router.navigateByUrl('/email-verification-pending');
      } else {
        this._alertService.showAlert(
          this._translocoService.translate('alerts.welcome'),
        );

        void this._router.navigateByUrl('/');
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.signUpFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }
}
