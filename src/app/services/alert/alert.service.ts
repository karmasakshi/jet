import { inject, Service, Signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Direction } from '@jet/types/direction.type';
import { translate } from '@jsverse/transloco';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Service()
export class AlertService {
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #loggerService = inject(LoggerService);
  readonly #settingsService = inject(SettingsService);

  readonly #direction: Signal<Direction>;

  public constructor() {
    this.#direction = this.#settingsService.direction;

    this.#loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(
    message: string,
    action: string = translate('alerts.ok'),
    callback?: () => void,
  ): void {
    const matSnackBarRef = this.#matSnackBar.open(message, action, {
      direction: this.#direction(),
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
