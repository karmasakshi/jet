import { Injectable, Signal, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Settings } from '@jet/interfaces/settings.interface';
import { take } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly _matSnackBar = inject(MatSnackBar);
  private readonly _loggerService = inject(LoggerService);
  private readonly _settingsService = inject(SettingsService);

  private readonly _settings: Signal<Settings>;

  public constructor() {
    this._settings = this._settingsService.settings;

    this._loggerService.logServiceInitialization('AlertService');
  }

  public showAlert(message: string, cta?: string, action?: () => void): void {
    const matSnackBarRef: MatSnackBarRef<TextOnlySnackBar> =
      this._matSnackBar.open(message, cta, {
        direction: this._settings().languageOption.directionality,
      });

    if (action !== undefined) {
      matSnackBarRef
        .onAction()
        .pipe(take(1))
        .subscribe((): void => {
          action();
        });
    }
  }
}
