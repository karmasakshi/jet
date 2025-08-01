import { Signal, signal, WritableSignal } from '@angular/core';

export class ServiceWorkerServiceMock {
  readonly #isUpdatePending: WritableSignal<boolean>;
  readonly #lastUpdateCheckTimestamp: WritableSignal<string>;

  public constructor() {
    this.#isUpdatePending = signal(false);

    this.#lastUpdateCheckTimestamp = signal(new Date().toISOString());
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

  public subscribeToVersionUpdates(): void {
    // Do nothing
  }
}
