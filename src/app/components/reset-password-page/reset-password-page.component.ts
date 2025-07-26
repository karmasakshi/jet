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
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-reset-password-page',
  styleUrl: './reset-password-page.component.scss',
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);

  private _isLoading: boolean;

  public readonly resetPasswordFormGroup: FormGroup<{
    email: FormControl<null | string>;
  }>;

  public constructor() {
    this._isLoading = false;

    this.resetPasswordFormGroup = this._formBuilder.group({
      email: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.email,
      ]),
    });

    this._loggerService.logComponentInitialization(
      'ResetPasswordPageComponent',
    );
  }

  public async resetPasswordForEmail(email: string) {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.resetPasswordFormGroup.disable();
    this._progressBarService.showIndeterminateProgressBar();

    try {
      const { error } = await this._userService.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      void this._router.navigateByUrl('/reset-password-email-sent');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.resetPasswordFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }
}
