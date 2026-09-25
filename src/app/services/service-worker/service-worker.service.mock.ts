import { Signal, signal, WritableSignal } from '@angular/core';

export class ServiceWorkerServiceMock {
  readonly #lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly lastUpdateCheckTimestamp: Signal<string>;

  public constructor() {
    const storedLastUpdateCheckTimestamp: null | string = null;

    this.#lastUpdateCheckTimestamp = signal(
      storedLastUpdateCheckTimestamp ?? new Date().toISOString(),
    );

    this.lastUpdateCheckTimestamp = this.#lastUpdateCheckTimestamp.asReadonly();
  }

  public async checkForUpdate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public subscribeToVersionUpdates(): void {
    // Do nothing
  }
}
