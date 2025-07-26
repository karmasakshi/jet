import { Signal, signal, WritableSignal } from '@angular/core';
import { Subscription } from 'rxjs';

export class ServiceWorkerServiceMock {
  private readonly _isUpdatePending: WritableSignal<boolean>;
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly serviceWorkerUpdateSubscription: Subscription;

  public constructor() {
    this._isUpdatePending = signal(false);

    this._lastUpdateCheckTimestamp = signal(new Date().toISOString());

    this.serviceWorkerUpdateSubscription = this._subscribeToUpdates();
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

  private _subscribeToUpdates(): Subscription {
    return Subscription.EMPTY;
  }
}
