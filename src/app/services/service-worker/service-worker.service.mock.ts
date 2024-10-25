import { Signal, WritableSignal, signal } from '@angular/core';
import { Subscription } from 'rxjs';

export class ServiceWorkerServiceMock {
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly serviceWorkerUpdateSubscription: Subscription;

  public constructor() {
    this._lastUpdateCheckTimestamp = signal(new Date().toISOString());

    this.serviceWorkerUpdateSubscription = this._subscribeToUpdates();
  }

  public get lastUpdateCheckTimestamp(): Signal<string> {
    return this._lastUpdateCheckTimestamp.asReadonly();
  }

  public checkForUpdate(): void {
    // Mock implementation, do nothing
  }

  private _subscribeToUpdates(): Subscription {
    return Subscription.EMPTY;
  }
}
