import { Observable, Subscription, of } from 'rxjs';

export class UpdateServiceMock {
  public readonly swUpdateSubscription: Subscription;
  public readonly lastUpdateCheckTimestamp$: Observable<string>;

  public constructor() {
    this.swUpdateSubscription = Subscription.EMPTY;
    this.lastUpdateCheckTimestamp$ = of('');
  }
  public checkForUpdate(): void {
    // Mock implementation, do nothing
  }
}
