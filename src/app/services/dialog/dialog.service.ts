import { inject, Service, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@jet/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '@jet/interfaces/confirmation-dialog-data.interface';
import { Direction } from '@jet/types/direction.type';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Service()
export class DialogService {
  readonly #matDialog = inject(MatDialog);
  readonly #loggerService = inject(LoggerService);
  readonly #settingsService = inject(SettingsService);

  readonly #direction: Signal<Direction>;

  public constructor() {
    this.#direction = this.#settingsService.direction;

    this.#loggerService.logServiceInitialization('DialogService');
  }

  public async confirm(confirmationDialogData: ConfirmationDialogData): Promise<boolean> {
    const isConfirmed = await firstValueFrom(
      this.#matDialog
        .open(ConfirmationDialogComponent, {
          data: confirmationDialogData,
          direction: this.#direction(),
        })
        .afterClosed(),
    );

    return isConfirmed === true;
  }
}
