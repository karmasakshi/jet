import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@jet/interfaces/confirmation-dialog-data.interface';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  imports: [MatButtonModule, MatDialogModule, TranslocoModule],
  selector: 'jet-confirmation-dialog',
  styles: ``,
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  readonly #matDialogData = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
  readonly #loggerService = inject(LoggerService);

  protected readonly message: ConfirmationDialogData['message'];

  public constructor() {
    this.message = this.#matDialogData.message;

    this.#loggerService.logComponentInitialization('ConfirmationDialogComponent');
  }
}
