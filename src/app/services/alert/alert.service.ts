import { Injectable, Signal, inject } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _matSnackBar = inject(MatSnackBar);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _settingsService = inject(SettingsService);

  private readonly _languageOption: Signal<LanguageOption>;

  public constructor() {
    this._languageOption = this._settingsService.languageOption;

    this._loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(
    message: string,
    cta: string = this._translocoService.translate('cta.ok'),
    action?: () => void,
  ): void {
    const matSnackBarRef: MatSnackBarRef<TextOnlySnackBar> =
      this._matSnackBar.open(message, cta, {
        direction: this._languageOption().directionality,
      });

    if (action) {
      matSnackBarRef
        .onAction()
        .pipe(take(1))
        .subscribe((): void => {
          action();
        });
    }
  }

  public showErrorAlert(
    message: string = this._translocoService.translate(
      'alerts.something-went-wrong',
    ),
  ): void {
    this.showAlert(message);
  }
}
