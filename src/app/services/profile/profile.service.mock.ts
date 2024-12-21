/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Profile } from '@jet/interfaces/profile.interface';
import { User } from '@jet/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileServiceMock {
  private readonly _profile: WritableSignal<Profile | undefined>;

  public constructor() {
    this._profile = signal(undefined);
  }

  public get profile(): Signal<Profile | undefined> {
    return this._profile.asReadonly();
  }

  public selectProfile(_userId: User['id'] | undefined): void {
    // Mock implementation, do nothing
  }

  public updateProfile(
    _partialProfile: Partial<Profile>,
  ): PromiseLike<unknown> {
    return Promise.resolve();
  }
}
