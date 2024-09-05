import { Signal, WritableSignal, signal } from '@angular/core';
import { User } from '@jet/interfaces/user.interface';

export class AuthenticationServiceMock {
  public get user(): Signal<User | null> {
    const user: WritableSignal<User | null> = signal(null);
    return user.asReadonly();
  }

  public login(): Promise<void> {
    return new Promise((): void => {
      // Mock implementation, do nothing
    });
  }

  public logout(): Promise<void> {
    return new Promise((): void => {
      // Mock implementation, do nothing
    });
  }
}
