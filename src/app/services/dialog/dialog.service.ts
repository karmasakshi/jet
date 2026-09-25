import { inject, Service, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@jet/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@jet/interfaces/confirmation-dialog-data.interface';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Service()
export class DialogService {
  readonly #matDialog = inject(MatDialog);
  readonly #loggerService = inject(LoggerService);
  readonly #settingsService = inject(SettingsService);

  readonly #directionality: Signal<LanguageOption['directionality']>;

  public constructor() {
    this.#directionality = this.#settingsService.directionality;

    this.#loggerService.logServiceInitialization('DialogService');
  }

  public async confirm(confirmationDialogData: ConfirmationDialogData): Promise<boolean> {
    const isConfirmed = await firstValueFrom(
      this.#matDialog
        .open(ConfirmationDialogComponent, {
          data: confirmationDialogData,
          direction: this.#directionality(),
        })
        .afterClosed(),
    );

    return isConfirmed === true;
  }
}
