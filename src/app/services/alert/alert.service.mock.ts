/* eslint-disable @typescript-eslint/no-unused-vars */

export class AlertServiceMock {
  public showAlert(_message: string, _action: string = '', _callback?: () => void): void {
    // Do nothing
  }

  public showExceptionAlert(_exception: unknown): void {
    // Do nothing
  }
}
