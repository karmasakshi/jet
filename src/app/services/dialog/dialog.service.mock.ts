/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConfirmationDialogData } from '@jet/interfaces/confirmation-dialog-data.interface';

export class DialogServiceMock {
  public async confirm(_confirmationDialogData: ConfirmationDialogData): Promise<boolean> {
    return Promise.resolve(true);
  }
}
