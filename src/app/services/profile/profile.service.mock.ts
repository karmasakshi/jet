/* eslint-disable @typescript-eslint/no-unused-vars */

import { Profile } from '@jet/interfaces/profile.interface';
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

  public selectProfile() {
    return Promise.resolve();
  }

  public updateAndSelectProfile(_partialProfile: Partial<Profile>) {
    return Promise.resolve();
  }

  public uploadAvatar(
    _file: File,
  ): Promise<
    | { data: { fullPath: string; id: string; path: string }; error: null }
    | { data: null; error: StorageError }
  > {
    return Promise.resolve({
      data: { fullPath: '', id: '', path: '' },
      error: null,
    });
  }
}
