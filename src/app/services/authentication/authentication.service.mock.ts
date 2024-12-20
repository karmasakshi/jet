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

  public getSession() {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  public getUser() {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  public signIn(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  public signOut(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
