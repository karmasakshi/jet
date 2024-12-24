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
    return this._supabaseClient.auth.resetPasswordForEmail(email);
  }

  public signInWithOauth(provider: Provider): Promise<OAuthResponse> {
    let redirectTo = `${window.location.origin}/sign-in`;
    const returnUrl = this._activatedRoute.snapshot.queryParamMap.get(
      QueryParam.ReturnUrl,
    );

    if (returnUrl !== null) {
      redirectTo +=
        '?' +
        new URLSearchParams({ [QueryParam.ReturnUrl]: returnUrl }).toString();
    }

    return this._supabaseClient.auth.signInWithOAuth({
      options: { redirectTo, skipBrowserRedirect: true },
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
