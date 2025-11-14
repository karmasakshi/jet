import { inject, Injectable, Signal } from '@angular/core';
import { SupabaseBucket } from '@jet/enums/supabase-bucket.enum';
import { SupabaseTable } from '@jet/enums/supabase-table.enum';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { Profile } from '@jet/interfaces/profile.interface';
import { FileObject, StorageError } from '@supabase/storage-js';
import { User } from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly #supabaseClient = inject(SUPABASE_CLIENT);
  readonly #loggerService = inject(LoggerService);
  readonly #userService = inject(UserService);

  readonly #user: Signal<null | User>;

  public constructor() {
    this.#user = this.#userService.user;

    this.#loggerService.logServiceInitialization('ProfileService');
  }

  public deleteAvatar(
    publicUrl: string,
  ): Promise<
    { data: FileObject[]; error: null } | { data: null; error: StorageError }
  > {
    const fileName: string | undefined = publicUrl.split('/').pop();
    const path: string = `${this.#userService.user()?.id}/${fileName}`;

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
      .eq('user_id', this.#user()?.id)
      .single()
      .throwOnError();
  }

  public updateAndSelectProfile(partialProfile: Partial<Profile>) {
    return this.#supabaseClient
      .from(SupabaseTable.Profiles)
      .update(partialProfile)
      .eq('user_id', this.#user()?.id)
      .select()
      .single()
      .throwOnError();
  }

  public uploadAvatar(
    file: File,
  ): Promise<
    | { data: { fullPath: string; id: string; path: string }; error: null }
    | { data: null; error: StorageError }
  > {
    const fileExtension: string | undefined = file.name.split('.').pop();
    const timestamp: number = Date.now();
    const path: string = `${this.#userService.user()?.id}/avatar-${timestamp}.${fileExtension}`;

    return this.#supabaseClient.storage
      .from(SupabaseBucket.Avatars)
      .upload(path, file);
  }
}
