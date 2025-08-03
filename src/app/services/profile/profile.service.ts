import { inject, Injectable, Signal } from '@angular/core';
import { SupabaseBucket } from '@jet/enums/supabase-bucket.enum';
import { SupabaseTable } from '@jet/enums/supabase-table.enum';
import { Profile } from '@jet/interfaces/profile.interface';
import { FileObject, StorageError } from '@supabase/storage-js/';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly #loggerService = inject(LoggerService);
  readonly #supabaseService = inject(SupabaseService);
  readonly #userService = inject(UserService);

  readonly #supabaseClient: SupabaseClient;
  readonly #user: Signal<null | User>;

  public constructor() {
    this.#supabaseClient = this.#supabaseService.supabaseClient;

    this.#user = this.#userService.user;

    this.#loggerService.logServiceInitialization('ProfileService');
  }

  public deleteAvatar(
    publicUrl: string,
  ): Promise<
    { data: FileObject[]; error: null } | { data: null; error: StorageError }
  > {
    const fileName: string | undefined = publicUrl.split('/').pop();
    const path = `${this.#userService.user()?.id}/${fileName}`;

    return this.#supabaseClient.storage
      .from(SupabaseBucket.Avatars)
      .remove([path]);
  }

  public getAvatarPublicUrl(path: string): string {
    const { data } = this.#supabaseClient.storage
      .from(SupabaseBucket.Avatars)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  public selectProfile() {
    return this.#supabaseClient
      .from(SupabaseTable.Profiles)
      .select()
      .eq('id', this.#user()?.id)
      .single()
      .throwOnError();
  }

  public updateProfile(partialProfile: Partial<Profile>) {
    return this.#supabaseClient
      .from(SupabaseTable.Profiles)
      .update(partialProfile)
      .eq('id', this.#user()?.id)
      .throwOnError();
  }

  public uploadAvatar(
    file: File,
  ): Promise<
    | { data: { fullPath: string; id: string; path: string }; error: null }
    | { data: null; error: StorageError }
  > {
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const path = `${this.#userService.user()?.id}/avatar-${timestamp}.${fileExtension}`;

    return this.#supabaseClient.storage
      .from(SupabaseBucket.Avatars)
      .upload(path, file);
  }
}
