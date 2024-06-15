import { Observable, Subscription, of } from 'rxjs';

export class UpdateServiceMock {
  public readonly swUpdateSubscription: Subscription = Subscription.EMPTY;
  public readonly lastUpdateCheckTimestamp$: Observable<string> = of(
    new Date().toISOString(),
  );

  public checkForUpdate(): void {
    // Mock implementation, do nothing
  }
}
