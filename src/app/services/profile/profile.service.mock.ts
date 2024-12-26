/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';
import { Profile } from '@jet/interfaces/profile.interface';
import { StorageError } from '@supabase/storage-js/';

export class ProfileServiceMock {
  private readonly _profile: WritableSignal<Profile | undefined>;

  public constructor() {
    this._profile = signal(undefined);
  }

  public get profile(): Signal<Profile | undefined> {
    return this._profile.asReadonly();
  }

  public getAvatarPublicUrl(_path: string): string {
    return '';
  }

  public selectProfile(): void {
    // Do nothing
  }

  public updateProfile(_partialProfile: Partial<Profile>) {
    return Promise.resolve();
  }

  public uploadAvatar(
    _file: File,
  ): Promise<
    | { data: { id: string; path: string; fullPath: string }; error: null }
    | { data: null; error: StorageError }
  > {
    return Promise.resolve({
      data: { fullPath: '', id: '', path: '' },
      error: null,
    });
  }
}
