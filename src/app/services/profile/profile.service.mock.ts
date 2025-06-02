/* eslint-disable @typescript-eslint/no-unused-vars */

import { Profile } from '@jet/interfaces/profile';
import { FileObject, StorageError } from '@supabase/storage-js/';

export class ProfileServiceMock {
  public deleteAvatar(
    _publicUrl: string,
  ): Promise<
    { data: FileObject[]; error: null } | { data: null; error: StorageError }
  > {
    return Promise.resolve({ data: [], error: null });
  }

  public getAvatarPublicUrl(_path: string): string {
    return '';
  }

  public selectProfile(_isAllFields: boolean) {
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
