import { inject, Injectable, Signal } from '@angular/core';
import { Bucket } from '@jet/enums/bucket.enum';
import { Table } from '@jet/enums/table.enum';
import { Profile } from '@jet/interfaces/profile.interface';
import { FileObject, StorageError } from '@supabase/storage-js/';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly _loggerService = inject(LoggerService);
  private readonly _supabaseService = inject(SupabaseService);
  private readonly _userService = inject(UserService);

  private readonly _supabaseClient: SupabaseClient;
  private readonly _user: Signal<null | User>;

  public constructor() {
    this._supabaseClient = this._supabaseService.supabaseClient;

    this._user = this._userService.user;

    this._loggerService.logServiceInitialization('ProfileService');
  }

  public deleteAvatar(
    publicUrl: string,
  ): Promise<
    { data: FileObject[]; error: null } | { data: null; error: StorageError }
  > {
    const fileName: undefined | string = publicUrl.split('/').pop();
    const path = `${this._userService.user()?.id}/${fileName}`;

    return this._supabaseClient.storage.from(Bucket.Avatars).remove([path]);
  }

  public getAvatarPublicUrl(path: string): string {
    const { data } = this._supabaseClient.storage
      .from(Bucket.Avatars)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  public selectProfile(isAllFields: boolean) {
    if (isAllFields) {
      return this._supabaseClient
        .from(Table.Profiles)
        .select()
        .eq('id', this._user()?.id)
        .single()
        .throwOnError();
    } else {
      return this._supabaseClient
        .from(Table.Profiles)
        .select('birth_year, gender')
        .eq('id', this._user()?.id)
        .single()
        .throwOnError();
    }
  }

  public updateProfile(partialProfile: Partial<Profile>) {
    return this._supabaseClient
      .from(Table.Profiles)
      .update(partialProfile)
      .eq('id', this._user()?.id)
      .throwOnError();
  }

  public uploadAvatar(
    file: File,
  ): Promise<
    | { data: { id: string; path: string; fullPath: string }; error: null }
    | { data: null; error: StorageError }
  > {
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const path = `${this._userService.user()?.id}/avatar-${timestamp}.${fileExtension}`;

    return this._supabaseClient.storage.from(Bucket.Avatars).upload(path, file);
  }
}
