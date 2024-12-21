import {
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { Tables } from '@jet/enums/tables.enum';
import { Profile } from '@jet/interfaces/profile.interface';
import { User } from '@jet/interfaces/user.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { LoggerService } from '../logger/logger.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _alertService = inject(AlertService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _supabaseService = inject(SupabaseService);

  private readonly _profile: WritableSignal<Profile | undefined>;
  private readonly _supabaseClient: SupabaseClient;

  public constructor() {
    this._profile = signal(undefined);

    this._supabaseClient = this._supabaseService.supabaseClient;

    effect(() => {
      const user: User | null = this._authenticationService.user();
      untracked(() => {
        this.selectProfile(user?.id);
      });
    });

    this._loggerService.logServiceInitialization('ProfileService');
  }

  public get profile(): Signal<Profile | undefined> {
    return this._profile.asReadonly();
  }

  public selectProfile(userId: User['id'] | undefined): void {
    if (userId === this.profile()?.id) {
      return;
    }

    if (userId === undefined) {
      this._profile.set(undefined);
      return;
    }

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

  public updateProfile(partialProfile: Partial<Profile>): PromiseLike<unknown> {
    const userId = this._authenticationService.user()?.id;

    if (userId === undefined) {
      return Promise.reject(new Error());
    }

    return this._supabaseClient
      .from(Tables.Profiles)
      .update(partialProfile)
      .eq('id', userId);
  }
}
