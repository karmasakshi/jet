import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { User } from '@jet/interfaces/user.interface';
import {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  AuthSession,
  AuthTokenResponsePassword,
  OAuthResponse,
  Provider,
  SupabaseClient,
} from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _loggerService = inject(LoggerService);
  private readonly _supabaseService = inject(SupabaseService);

  private readonly _supabaseClient: SupabaseClient;
  private readonly _user: WritableSignal<User | null>;

  public constructor() {
    this._supabaseClient = this._supabaseService.supabaseClient;

    this._user = signal(null);

    this._supabaseClient.auth.onAuthStateChange(
      (_authChangeEvent: AuthChangeEvent, authSession: AuthSession | null) => {
        this._user.set(authSession?.user ?? null);
      },
    );

    this._loggerService.logServiceInitialization('AuthenticationService');
  }

  public get user(): Signal<User | null> {
    return this._user.asReadonly();
  }

  public getSession() {
    return this._supabaseClient.auth.getSession();
  }

  public getUser() {
    return this._supabaseClient.auth.getUser();
  }

  public resetPassword(email: string) {
    return this._supabaseClient.auth.resetPasswordForEmail(email);
  }

  public signInWithOauth(
    provider: Provider = 'google',
  ): Promise<OAuthResponse> {
    const returnUrl = this._activatedRoute.snapshot.queryParamMap.get(
      QueryParam.ReturnUrl,
    );

    let redirectTo = `${window.location.protocol}//${window.location.host}/sign-in`;

    if (returnUrl !== null) {
      redirectTo += '?' + new URLSearchParams({ returnUrl }).toString();
    }

    return this._supabaseClient.auth.signInWithOAuth({
      options: { redirectTo },
      provider,
    });
  }

  public signIn(
    email: string,
    password: string,
  ): Promise<AuthTokenResponsePassword> {
    return this._supabaseClient.auth.signInWithPassword({ email, password });
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return this._supabaseClient.auth.signOut();
  }

  public signUp(email: string, password: string): Promise<AuthResponse> {
    return this._supabaseClient.auth.signUp({ email, password });
  }
}
