/* eslint-disable @typescript-eslint/no-unused-vars */

export class AlertServiceMock {
  public showAlert(_message: string, _cta = '', _action?: () => void): void {
    // Do nothing
  }

  public showErrorAlert(_message = ''): void {
    // Do nothing
  }
}
