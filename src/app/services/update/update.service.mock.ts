import { Observable, Subscription, of } from 'rxjs';

export class UpdateServiceMock {
  public readonly swUpdateSubscription: Subscription = Subscription.EMPTY;
  public readonly lastUpdateCheckTimestamp$: Observable<string> = of('');

  public checkForUpdate(): void {
    // Mock implementation, do nothing
  }
}
