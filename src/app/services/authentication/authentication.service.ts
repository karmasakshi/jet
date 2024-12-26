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
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  AuthSession,
  AuthTokenResponsePassword,
  OAuthResponse,
  SupabaseClient,
  UserAttributes,
  UserResponse,
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

  public getSession(): Promise<
    | { data: { session: AuthSession }; error: null }
    | { data: { session: null }; error: AuthError }
    | { data: { session: null }; error: null }
  > {
    return this._supabaseClient.auth.getSession();
  }

  public resetPassword(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ): Promise<{ data: {}; error: null } | { data: null; error: AuthError }> {
    const redirectTo = new URL('/sign-in', window.location.origin);
    redirectTo.searchParams.set(QueryParam.ReturnUrl, 'update-password');
    return this._supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo.toString(),
    });
  }

  public signInWithOauth(
    oauthProvider: AvailableOauthProvider,
  ): Promise<OAuthResponse> {
    const redirectTo = new URL('/sign-in', window.location.origin);
    const returnUrl = this._activatedRoute.snapshot.queryParamMap.get(
      QueryParam.ReturnUrl,
    );

    if (returnUrl) {
      redirectTo.searchParams.set(QueryParam.ReturnUrl, returnUrl);
    }

    return this._supabaseClient.auth.signInWithOAuth({
      options: { redirectTo: redirectTo.toString(), skipBrowserRedirect: true },
      provider: oauthProvider,
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
    const redirectTo = new URL('/sign-in', window.location.origin);
    return this._supabaseClient.auth.signUp({
      email,
      options: { emailRedirectTo: redirectTo.toString() },
      password,
    });
  }

  public updateUser(userAttributes: UserAttributes): Promise<UserResponse> {
    return this._supabaseClient.auth.updateUser(userAttributes);
  }
}
