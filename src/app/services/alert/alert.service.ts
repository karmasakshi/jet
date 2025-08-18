import { inject, Injectable, Signal } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #translocoService = inject(TranslocoService);
  readonly #loggerService = inject(LoggerService);
  readonly #settingsService = inject(SettingsService);

  readonly #languageOption: Signal<LanguageOption>;

  public constructor() {
    this.#languageOption = this.#settingsService.languageOption;

    this.#loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(
    message: string,
    cta: string = this.#translocoService.translate('alert-ctas.ok'),
    action?: () => void,
  ): void {
    const matSnackBarRef: MatSnackBarRef<TextOnlySnackBar> =
      this.#matSnackBar.open(message, cta, {
        direction: this.#languageOption().directionality,
      });

    if (action) {
      matSnackBarRef
        .onAction()
        .pipe(take(1))
        .subscribe(() => {
          action();
        });
    }
  }

  public showErrorAlert(
    message: string = this.#translocoService.translate(
      'alerts.something-went-wrong',
    ),
  ): void {
    this.showAlert(message);
  }
}
