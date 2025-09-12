import {
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import {
  AuthChangeEvent,
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthSession,
  AuthTokenResponsePassword,
  JwtHeader,
  JwtPayload,
  OAuthResponse,
  User,
  UserAttributes,
  UserResponse,
} from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #supabaseClient = inject(SUPABASE_CLIENT);
  readonly #loggerService = inject(LoggerService);

  readonly #user: WritableSignal<null | User>;

  public constructor() {
    this.#user = signal(null);

    this.#supabaseClient.auth.onAuthStateChange(
      (
        _authChangeEvent: AuthChangeEvent,
        authSession: AuthSession | null,
      ): void => {
        this.#user.set(authSession?.user ?? null);
      },
    );

    this.#loggerService.logServiceInitialization('UserService');
  }

  public get user(): Signal<null | User> {
    return this.#user.asReadonly();
  }

  public getClaims(): Promise<
    | {
        data: { claims: JwtPayload; header: JwtHeader; signature: Uint8Array };
        error: null;
      }
    | { data: null; error: AuthError }
    | { data: null; error: null }
  > {
    return this.#supabaseClient.auth.getClaims();
  }

  public resetPasswordForEmail(
    email: string,
  ): Promise<{ data: null; error: AuthError } | { data: object; error: null }> {
    return this.#supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: this.#getRedirectUrlWithReturnUrl('/update-password'),
    });
  }

  public signInWithOauth(
    oauthProvider: AvailableOauthProvider,
  ): Promise<OAuthResponse> {
    return this.#supabaseClient.auth.signInWithOAuth({
      options: {
        redirectTo: this.#getRedirectUrlWithReturnUrl(),
        skipBrowserRedirect: true,
      },
      provider: oauthProvider,
    });
  }

  public signInWithOtp(email: string): Promise<AuthOtpResponse> {
    return this.#supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.#getRedirectUrlWithReturnUrl(),
        shouldCreateUser: false,
      },
    });
  }

  public signInWithPassword(
    email: string,
    password: string,
  ): Promise<AuthTokenResponsePassword> {
    return this.#supabaseClient.auth.signInWithPassword({ email, password });
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return this.#supabaseClient.auth.signOut();
  }

  public signUp(email: string, password: string): Promise<AuthResponse> {
    return this.#supabaseClient.auth.signUp({
      email,
      options: { emailRedirectTo: this.#getRedirectUrlWithReturnUrl() },
      password,
    });
  }

  public updateUser(userAttributes: UserAttributes): Promise<UserResponse> {
    return this.#supabaseClient.auth.updateUser(userAttributes);
  }

  #getRedirectUrlWithReturnUrl(
    returnUrl = this.#activatedRoute.snapshot.queryParamMap.get(
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
