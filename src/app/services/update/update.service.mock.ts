import { Signal, WritableSignal, signal } from '@angular/core';
import { Subscription } from 'rxjs';

export class UpdateServiceMock {
  private readonly _lastUpdateCheckTimestamp: WritableSignal<string>;

  public readonly swUpdateSubscription: Subscription;

  public constructor() {
    this._lastUpdateCheckTimestamp = signal(new Date().toISOString());

    this.swUpdateSubscription = this._subscribeToUpdates();
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
