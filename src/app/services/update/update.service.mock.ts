import { Subscription } from 'rxjs';

export class UpdateServiceMock {
  public readonly swUpdateSubscription: Subscription;

  public constructor() {
    this.swUpdateSubscription = Subscription.EMPTY;
  }
  public checkForUpdate(): void {
    // Mock implementation, do nothing
  }
}
