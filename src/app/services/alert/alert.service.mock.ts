/* eslint-disable @typescript-eslint/no-unused-vars */

export class AlertServiceMock {
  public showAlert(_message: string, _cta = 'OK', _action?: () => void): void {
    // Do nothing
  }

  public showErrorAlert(_message = 'Something went wrong.'): void {
    // Do nothing
  }
}
