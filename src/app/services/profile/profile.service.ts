import {
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { Buckets } from '@jet/enums/buckets.enum';
import { Tables } from '@jet/enums/tables.enum';
import { Profile } from '@jet/interfaces/profile.interface';
import { User } from '@jet/interfaces/user.interface';
import { StorageError } from '@supabase/storage-js/';
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

  private readonly _profile: WritableSignal<Profile | undefined>;
  private readonly _supabaseClient: SupabaseClient;

  public constructor() {
    this._profile = signal(undefined);

    this._supabaseClient = this._supabaseService.supabaseClient;

    effect(() => {
      const user: User | null = this._userService.user();
      untracked(() => {
        if (user === null) {
          this._profile.set(undefined);
        } else {
          this.selectProfile();
        }
      });
    });

    this._loggerService.logServiceInitialization('ProfileService');
  }

  public get profile(): Signal<Profile | undefined> {
    return this._profile.asReadonly();
  }

  public getAvatarPublicUrl(path: string): string {
    const { data } = this._supabaseClient.storage
      .from(Buckets.Avatars)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  public selectProfile(): void {
    const userId = this._userService.user()?.id;

    this._supabaseClient
      .from(Tables.Profiles)
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }): void => {
        if (error) {
          this._loggerService.logError(error);
          this._alertService.showErrorAlert(error.message);
        } else {
          this._profile.set(data as Profile);
        }
      });
  }

  public updateProfile(partialProfile: Partial<Profile>) {
    const userId = this._userService.user()?.id;

    if (userId === undefined) {
      return Promise.reject(new Error());
    }

    return this._supabaseClient
      .from(Tables.Profiles)
      .update(partialProfile)
      .eq('id', userId);
  }

  public uploadAvatar(
    file: File,
  ): Promise<
    | { data: { id: string; path: string; fullPath: string }; error: null }
    | { data: null; error: StorageError }
  > {
    const fileExt = file.name.split('.').pop();
    const path = `${this._userService.user()?.id}/avatar.${fileExt}`;
    return this._supabaseClient.storage
      .from(Buckets.Avatars)
      .upload(path, file, { upsert: true });
  }
}
