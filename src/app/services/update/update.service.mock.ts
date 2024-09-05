import { Signal, WritableSignal, signal } from '@angular/core';
import { Subscription } from 'rxjs';

export class UpdateServiceMock {
  public readonly swUpdateSubscription: Subscription = Subscription.EMPTY;

  public get lastUpdateCheckTimestamp(): Signal<string> {
    const lastUpdateCheckTimestamp: WritableSignal<string> = signal(
      new Date().toISOString(),
    );
    return lastUpdateCheckTimestamp.asReadonly();
  }

  public checkForUpdate(): void {
    // Mock implementation, do nothing
  }
}
