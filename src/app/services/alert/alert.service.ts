import { inject, Service, Signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { translate } from '@jsverse/transloco';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Service()
export class AlertService {
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #loggerService = inject(LoggerService);
  readonly #settingsService = inject(SettingsService);

  readonly #directionality: Signal<LanguageOption['directionality']>;

  public constructor() {
    this.#directionality = this.#settingsService.directionality;

    this.#loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(
    message: string,
    action: string = translate('alerts.ok'),
    callback?: () => void,
  ): void {
    const matSnackBarRef = this.#matSnackBar.open(message, action, {
      direction: this.#directionality(),
    });

    if (callback) {
      matSnackBarRef.onAction().subscribe(callback);
    }
  }

  public showExceptionAlert(exception: unknown): void {
    if (exception instanceof Error) {
      this.showAlert(exception.message);
    } else {
      this.showAlert(translate('alerts.something-went-wrong'));
    }
  }
}
