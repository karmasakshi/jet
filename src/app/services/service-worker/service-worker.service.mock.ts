import { Signal, signal, WritableSignal } from '@angular/core';

export class ServiceWorkerServiceMock {
  readonly #lastUpdateCheckTimestamp: WritableSignal<string>;

  public constructor() {
    const storedLastUpdateCheckTimestamp: null | string = null;

    this.#lastUpdateCheckTimestamp = signal(
      storedLastUpdateCheckTimestamp ?? new Date().toISOString(),
    );

    this._subscribeToVersionUpdates();
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this.#lastUpdateCheckTimestamp.asReadonly();
  }

  public async checkForUpdate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  private _subscribeToVersionUpdates(): void {
    // Do nothing
  }
}
