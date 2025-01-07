/* eslint-disable @typescript-eslint/no-unused-vars */

export class AlertServiceMock {
  private readonly _defaultCta: string;
  private readonly _defaultErrorMessage: string;

  public constructor() {
    this._defaultCta = 'OK';

    this._defaultErrorMessage = 'Something went wrong.';
  }

  public showAlert(
    _message: string,
    _cta: string = this._defaultCta,
    _action?: () => void,
  ): void {
    // Do nothing
  }

  public showErrorAlert(_message: string = this._defaultErrorMessage): void {
    // Do nothing
  }
}
