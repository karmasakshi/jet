import { inject, Service } from '@angular/core';
import { SupabaseStorageBucket } from '@jet/enums/supabase-storage-bucket.enum';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { ProfileUpdate } from '@jet/types/supabase/profile.type';
import { FileObject, StorageError } from '@supabase/storage-js';
import { LoggerService } from '../logger/logger.service';
import { UserService } from '../user/user.service';

@Service({ autoProvided: false })
export class ProfileService {
  readonly #supabaseClient = inject(SUPABASE_CLIENT);
  readonly #loggerService = inject(LoggerService);
  readonly #userService = inject(UserService);

  public constructor() {
    this.#loggerService.logServiceInitialization('ProfileService');
  }

  public deleteAvatar(
    publicUrl: string,
  ): Promise<{ data: FileObject[]; error: null } | { data: null; error: StorageError }> {
    const fileName: string | undefined = publicUrl.split('/').pop();
    const path = `${this.#userService.user()?.id}/${fileName}`;

    return this.#supabaseClient.storage.from(SupabaseStorageBucket.ProfileAvatars).remove([path]);
  }

  public getAvatarPublicUrl(path: string): string {
    const { data } = this.#supabaseClient.storage
      .from(SupabaseStorageBucket.ProfileAvatars)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  public selectProfile() {
    return this.#supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', this.#userService.user()?.id ?? '')
      .single()
      .throwOnError();
  }

  public updateAndSelectProfile(profile: ProfileUpdate) {
    return this.#supabaseClient
      .from('profiles')
      .update(profile)
      .eq('user_id', this.#userService.user()?.id ?? '')
      .select('*')
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
    const path = `${this.#userService.user()?.id}/avatar-${timestamp}.${fileExtension}`;

    return this.#supabaseClient.storage
      .from(SupabaseStorageBucket.ProfileAvatars)
      .upload(path, file);
  }
}
