/* eslint-disable @typescript-eslint/no-unused-vars */

export class AlertServiceMock {
  public showAlert(
    _message: string,
    _cta?: string,
    _action?: () => void,
  ): void {
    // Mock implementation, do nothing
  }
}
