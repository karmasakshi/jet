/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';
import { Profile } from '@jet/interfaces/profile.interface';
import { FileObject, StorageError } from '@supabase/storage-js/';

export class ProfileServiceMock {
  private readonly _profile: WritableSignal<Profile | null>;

  public constructor() {
    this._profile = signal(null);
  }

  public get profile(): Signal<Profile | null> {
    return this._profile.asReadonly();
  }

  public getAvatarPublicUrl(_path: string): string {
    return '';
  }

  public deleteAvatar(
    _publicUrl: string,
  ): Promise<
    { data: FileObject[]; error: null } | { data: null; error: StorageError }
  > {
    return Promise.resolve({ data: [], error: null });
  }

  public async selectProfile(): Promise<void> {
    return Promise.resolve();
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
