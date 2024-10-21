import { Signal, WritableSignal, signal } from '@angular/core';
import { User } from '@jet/interfaces/user.interface';

export class AuthenticationServiceMock {
  private readonly _user: WritableSignal<User | null>;

  public constructor() {
    this._user = signal(null);
  }

  public get user(): Signal<User | null> {
    return this._user.asReadonly();
  }

  public async login(): Promise<void> {
    await new Promise<void>((resolve) => {
      resolve();
    });
  }

  public async logout(): Promise<void> {
    await new Promise<void>((resolve) => {
      resolve();
    });
  }
}
