import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import {
  AuthChangeEvent,
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthSession,
  AuthTokenResponsePassword,
  OAuthResponse,
  SupabaseClient,
  User,
  UserAttributes,
  UserResponse,
} from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

    this._loggerService.logServiceInitialization('UserService');
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

  public resetPasswordForEmail(
    email: string,
  ): Promise<{ data: object; error: null } | { data: null; error: AuthError }> {
    return this._supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: this._getRedirectUrlWithReturnUrl('/update-password'),
    });
  }

  public signInWithOauth(
    oauthProvider: AvailableOauthProvider,
  ): Promise<OAuthResponse> {
    return this._supabaseClient.auth.signInWithOAuth({
      options: {
        redirectTo: this._getRedirectUrlWithReturnUrl(),
        skipBrowserRedirect: true,
      },
      provider: oauthProvider,
    });
  }

  public signInWithOtp(email: string): Promise<AuthOtpResponse> {
    return this._supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this._getRedirectUrlWithReturnUrl(),
        shouldCreateUser: false,
      },
    });
  }

  public signInWithPassword(
    email: string,
    password: string,
  ): Promise<AuthTokenResponsePassword> {
    return this._supabaseClient.auth.signInWithPassword({ email, password });
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return this._supabaseClient.auth.signOut();
  }

  public signUp(email: string, password: string): Promise<AuthResponse> {
    return this._supabaseClient.auth.signUp({
      email,
      options: { emailRedirectTo: this._getRedirectUrlWithReturnUrl() },
      password,
    });
  }

  public updateUser(userAttributes: UserAttributes): Promise<UserResponse> {
    return this._supabaseClient.auth.updateUser(userAttributes);
  }

  private _getRedirectUrlWithReturnUrl(
    returnUrl = this._activatedRoute.snapshot.queryParamMap.get(
      QueryParam.ReturnUrl,
    ),
  ): string {
    const redirectUrl = new URL('/sign-in', window.location.origin);

    if (returnUrl) {
      redirectUrl.searchParams.set(QueryParam.ReturnUrl, returnUrl);
    }

    return redirectUrl.toString();
  }
}
