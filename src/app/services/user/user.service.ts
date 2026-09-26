import { computed, DOCUMENT, inject, Service, Signal, signal, WritableSignal } from '@angular/core';
import { QueryParam } from '@jet/enums/query-param.enum';
import { SUPABASE_CLIENT } from '@jet/injection-tokens/supabase-client.injection-token';
import { CustomUserAppMetadata } from '@jet/interfaces/custom-user-app-metadata.interface';
import {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Provider,
  Session,
  SignInWithPasswordlessCredentials,
  User,
  UserAttributes,
  UserResponse,
  VerifyOtpParams,
} from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';
import { LoggerService } from '../logger/logger.service';

@Service()
export class UserService {
  readonly #document = inject(DOCUMENT);
  readonly #supabaseClient = inject(SUPABASE_CLIENT);
  readonly #loggerService = inject(LoggerService);

  readonly #session: WritableSignal<null | Session>;

  public readonly hasEmail: Signal<boolean>;
  public readonly isAdmin: Signal<boolean>;
  public readonly isSignedIn: Signal<boolean>;
  public readonly user: Signal<null | User>;

  public constructor() {
    this.#session = signal(null);

    this.hasEmail = computed(() => Boolean(this.#session()?.user.email));

    this.isAdmin = computed(() => {
      const session = this.#session();

      return session === null
        ? false
        : jwtDecode<{ app_metadata: CustomUserAppMetadata }>(session.access_token).app_metadata
            .app_role === 'admin';
    });

    this.isSignedIn = computed(() => this.#session() !== null);

    this.user = computed(() => this.#session()?.user ?? null);

    this.#supabaseClient.auth.onAuthStateChange((_event, session) => {
      this.#session.set(session);
    });

    this.#loggerService.logServiceInitialization('UserService');
  }

  public resetPasswordForEmail(
    email: string,
  ): Promise<{ data: null; error: AuthError } | { data: object; error: null }> {
    return this.#supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: this.#getRedirectUrlWithReturnUrl('/update-password'),
    });
  }

  public signInWithOauth(provider: Provider, returnUrl: string): Promise<OAuthResponse> {
    return this.#supabaseClient.auth.signInWithOAuth({
      options: {
        redirectTo: this.#getRedirectUrlWithReturnUrl(returnUrl),
        skipBrowserRedirect: true,
      },
      provider,
    });
  }

  public signInWithOtp(
    credentials: SignInWithPasswordlessCredentials,
    returnUrl?: string,
  ): Promise<AuthOtpResponse> {
    if ('email' in credentials && returnUrl !== undefined) {
      return this.#supabaseClient.auth.signInWithOtp({
        ...credentials,
        options: {
          ...credentials.options,
          emailRedirectTo: this.#getRedirectUrlWithReturnUrl(returnUrl),
        },
      });
    }

    return this.#supabaseClient.auth.signInWithOtp(credentials);
  }

  public signInWithPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    return this.#supabaseClient.auth.signInWithPassword({ email, password });
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return this.#supabaseClient.auth.signOut();
  }

  public signUp(email: string, password: string, returnUrl: string): Promise<AuthResponse> {
    return this.#supabaseClient.auth.signUp({
      email,
      options: { emailRedirectTo: this.#getRedirectUrlWithReturnUrl(returnUrl) },
      password,
    });
  }

  public updateUser(userAttributes: UserAttributes): Promise<UserResponse> {
    return this.#supabaseClient.auth.updateUser(userAttributes);
  }

  public verifyOtp(params: VerifyOtpParams): Promise<AuthResponse> {
    return this.#supabaseClient.auth.verifyOtp(params);
  }

  #getRedirectUrlWithReturnUrl(returnUrl: string): string {
    const redirectUrl = new URL('/sign-in', this.#document.location.origin);

    redirectUrl.searchParams.set(QueryParam.ReturnUrl, returnUrl);

    return redirectUrl.toString();
  }
}
