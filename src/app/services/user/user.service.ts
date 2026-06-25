import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { QueryParam } from '@jet/enums/query-param.enum';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { OauthProvider } from '@jet/types/oauth-provider.type';
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
  UserAttributes,
  UserResponse,
} from '@supabase/supabase-js';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UserService {
  readonly #supabaseClient = inject(SUPABASE_CLIENT);
  readonly #loggerService = inject(LoggerService);

  readonly #claims: WritableSignal<JwtPayload | null>;

  public constructor() {
    this.#claims = signal(null);

    this.#supabaseClient.auth.onAuthStateChange(
      (_authChangeEvent: AuthChangeEvent, authSession: AuthSession | null): void => {
        if (authSession === null) {
          this.#claims.set(null);
        }
      },
    );

    this.#loggerService.logServiceInitialization('UserService');
  }

  public get claims(): Signal<JwtPayload | null> {
    return this.#claims.asReadonly();
  }

  public async getClaims(): Promise<
    | { data: { claims: JwtPayload; header: JwtHeader; signature: Uint8Array }; error: null }
    | { data: null; error: AuthError }
    | { data: null; error: null }
  > {
    const response = await this.#supabaseClient.auth.getClaims();

    this.#claims.set(response.data?.claims ?? null);

    return response;
  }

  public resetPasswordForEmail(
    email: string,
  ): Promise<{ data: null; error: AuthError } | { data: object; error: null }> {
    return this.#supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: this.#getRedirectUrlWithReturnUrl('/update-password'),
    });
  }

  public signInWithOauth(oauthProvider: OauthProvider, returnUrl?: string): Promise<OAuthResponse> {
    return this.#supabaseClient.auth.signInWithOAuth({
      options: {
        redirectTo: this.#getRedirectUrlWithReturnUrl(returnUrl),
        skipBrowserRedirect: true,
      },
      provider: oauthProvider,
    });
  }

  public signInWithOtp(email: string, returnUrl?: string): Promise<AuthOtpResponse> {
    return this.#supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.#getRedirectUrlWithReturnUrl(returnUrl),
        shouldCreateUser: false,
      },
    });
  }

  public signInWithPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.#supabaseClient.auth.signInWithPassword({ email, password });
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return this.#supabaseClient.auth.signOut();
  }

  public signUp(email: string, password: string, returnUrl?: string): Promise<AuthResponse> {
    return this.#supabaseClient.auth.signUp({
      email,
      options: { emailRedirectTo: this.#getRedirectUrlWithReturnUrl(returnUrl) },
      password,
    });
  }

  public updateUser(userAttributes: UserAttributes): Promise<UserResponse> {
    return this.#supabaseClient.auth.updateUser(userAttributes);
  }

  #getRedirectUrlWithReturnUrl(returnUrl?: string): string {
    const redirectUrl: URL = new URL('/sign-in', window.location.origin);

    if (returnUrl) {
      redirectUrl.searchParams.set(QueryParam.ReturnUrl, returnUrl);
    }

    return redirectUrl.toString();
  }
}
