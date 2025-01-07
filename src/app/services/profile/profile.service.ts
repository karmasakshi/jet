import {
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { Bucket } from '@jet/enums/bucket.enum';
import { Table } from '@jet/enums/table.enum';
import { Profile } from '@jet/interfaces/profile.interface';
import { User } from '@jet/interfaces/user.interface';
import { FileObject, StorageError } from '@supabase/storage-js/';
import { SupabaseClient } from '@supabase/supabase-js';
import { AlertService } from '../alert/alert.service';
import { LoggerService } from '../logger/logger.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _supabaseService = inject(SupabaseService);
  private readonly _userService = inject(UserService);

  private readonly _profile: WritableSignal<Profile | null>;
  private readonly _supabaseClient: SupabaseClient;

  public constructor() {
    this._profile = signal(null);

    this._supabaseClient = this._supabaseService.supabaseClient;

    effect(() => {
      const user: User | null = this._userService.user();
      untracked(() => {
        if (user === null) {
          this._profile.set(null);
        } else {
          void this.selectProfile();
        }
      });
    });

    this._loggerService.logServiceInitialization('ProfileService');
  }

  public get profile(): Signal<Profile | null> {
    return this._profile.asReadonly();
  }

  public getAvatarPublicUrl(path: string): string {
    const { data } = this._supabaseClient.storage
      .from(Bucket.Avatars)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  public deleteAvatar(
    publicUrl: string,
  ): Promise<
    { data: FileObject[]; error: null } | { data: null; error: StorageError }
  > {
    const fileName = publicUrl.split('/').pop();
    const path = `${this._userService.user()?.id}/${fileName}`;
    return this._supabaseClient.storage.from(Bucket.Avatars).remove([path]);
  }

  public async selectProfile(): Promise<void> {
    const userId = this._userService.user()?.id;

    try {
      const { data, error } = await this._supabaseClient
        .from(Table.Profiles)
        .select('*')
        .eq('id', userId)
        .single<Profile>();

      if (error) {
        throw error;
      }

      this._profile.set(data);
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    }
  }

  public updateProfile(partialProfile: Partial<Profile>) {
    const userId = this._userService.user()?.id;

    if (userId === undefined) {
      return Promise.reject(new Error());
    }

    return this._supabaseClient
      .from(Table.Profiles)
      .update(partialProfile)
      .eq('id', userId);
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
