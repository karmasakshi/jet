import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { LanguageOption } from '@xxx/interfaces/language-option.interface';
import { take } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _directionality: LanguageOption['directionality'];

  public constructor(
    private readonly _matSnackBar: MatSnackBar,
    private readonly _settingsService: SettingsService,
    private readonly _loggerService: LoggerService,
  ) {
    this._directionality =
      this._settingsService.settings.languageOption.directionality;

    this._loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(message: string, cta?: string, action?: () => void): void {
    const matSnackBarRef: MatSnackBarRef<TextOnlySnackBar> =
      this._matSnackBar.open(message, cta, {
        direction: this._directionality,
        duration: 9000,
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
}
