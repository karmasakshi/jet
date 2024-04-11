import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Language } from '@xxx/interfaces/language.interface';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _directionality: Language['directionality'];

  public constructor(
    private readonly _matSnackBar: MatSnackBar,
    private readonly _settingsService: SettingsService,
    private readonly _loggerService: LoggerService,
  ) {
    this._directionality =
      this._settingsService.settings.language.directionality;

    this._loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(message: string, cta?: string, action?: () => void): void {
    const matSnackBarRef: MatSnackBarRef<TextOnlySnackBar> =
      this._matSnackBar.open(message, cta, {
        direction: this._directionality,
        duration: 9000,
      });

    if (action) {
      matSnackBarRef.onAction().subscribe(() => {
        action();
      });
    }
  }
}
