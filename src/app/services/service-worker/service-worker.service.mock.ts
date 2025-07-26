import { Signal, signal, WritableSignal } from '@angular/core';

export class ServiceWorkerServiceMock {
  private readonly _isUpdatePending: WritableSignal<boolean>;
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public constructor() {
    this._isUpdatePending = signal(false);

    this._lastUpdateCheckTimestamp = signal(new Date().toISOString());
  }

  public get isUpdatePending(): Signal<boolean> {
    return this._isUpdatePending.asReadonly();
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this._lastUpdateCheckTimestamp.asReadonly();
  }

  public alertUpdateAvailability(): void {
    // Do nothing
  }

  public checkForUpdate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public subscribeToVersionUpdates(): void {
    // Do nothing
  }
}
