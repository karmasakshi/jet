import { Signal, signal, WritableSignal } from '@angular/core';

export class ServiceWorkerServiceMock {
  readonly #isUpdatePending: WritableSignal<boolean>;
  readonly #lastUpdateCheckTimestamp: WritableSignal<string>;

  public constructor() {
    this.#isUpdatePending = signal(false);

    const storedLastUpdateCheckTimestamp: null | string = null;

    this.#lastUpdateCheckTimestamp = signal(
      storedLastUpdateCheckTimestamp ?? new Date().toISOString(),
    );

    this._subscribeToVersionUpdates();
  }

  public get isUpdatePending(): Signal<boolean> {
    return this.#isUpdatePending.asReadonly();
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this.#lastUpdateCheckTimestamp.asReadonly();
  }

  public alertUpdateAvailability(): void {
    // Do nothing
  }

  public checkForUpdate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  private _subscribeToVersionUpdates(): void {
    // Do nothing
  }
}
