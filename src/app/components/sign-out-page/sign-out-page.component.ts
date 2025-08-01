import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-sign-out-page',
  styleUrl: './sign-out-page.component.scss',
  templateUrl: './sign-out-page.component.html',
})
export class SignOutPageComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);
  readonly #translocoService = inject(TranslocoService);

  #isLoading: boolean;

  public constructor() {
    this.#isLoading = false;

    this.#loggerService.logComponentInitialization('SignOutPageComponent');
  }

  public ngOnInit(): void {
    void this.#signOut();
  }

  async #signOut(): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { error } = await this.#userService.signOut();

      if (error) {
        throw error;
      }

      this.#alertService.showAlert(
        this.#translocoService.translate('alerts.signed-out-successfully'),
      );

      void this.#router.navigateByUrl('/');
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.#progressBarService.hideProgressBar();
    }
  }
}
