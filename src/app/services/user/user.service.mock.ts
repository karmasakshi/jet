/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';
import {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Provider,
  SignInWithPasswordlessCredentials,
  User,
  UserAttributes,
  UserResponse,
  VerifyOtpParams,
} from '@supabase/supabase-js';

export class UserServiceMock {
  readonly #isSignedIn: WritableSignal<boolean>;
  readonly #user: WritableSignal<null | User>;

  public readonly isSignedIn: Signal<boolean>;
  public readonly isAdmin: Signal<boolean>;
  public readonly hasEmail: Signal<boolean>;
  public readonly user: Signal<null | User>;

  public constructor() {
    this.hasEmail = signal(false);
    this.isAdmin = signal(false);
    this.#isSignedIn = signal(false);
    this.#user = signal(null);

    this.isSignedIn = this.#isSignedIn.asReadonly();
    this.user = this.#user.asReadonly();
  }

  public resetPasswordForEmail(
    _email: string,
  ): Promise<{ data: null; error: AuthError } | { data: object; error: null }> {
    return Promise.resolve({ data: {}, error: null });
  }

  public setIsSignedIn(isSignedIn: boolean): void {
    this.#isSignedIn.set(isSignedIn);
  }

  public signInWithOauth(_provider: Provider, _returnUrl: string): Promise<OAuthResponse> {
    return Promise.resolve({} as OAuthResponse);
  }

  public signInWithOtp(
    _credentials: SignInWithPasswordlessCredentials,
    _returnUrl?: string,
  ): Promise<AuthOtpResponse> {
    return Promise.resolve({} as AuthOtpResponse);
  }

  public signInWithPassword(_email: string, _password: string): Promise<AuthTokenResponsePassword> {
    return Promise.resolve({} as AuthTokenResponsePassword);
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return Promise.resolve({ error: null });
  }

  public signUp(_email: string, _password: string, _returnUrl: string): Promise<AuthResponse> {
    return Promise.resolve({} as AuthResponse);
  }

  public updateUser(_userAttributes: UserAttributes): Promise<UserResponse> {
    return Promise.resolve({} as UserResponse);
  }

  public verifyOtp(_params: VerifyOtpParams): Promise<AuthResponse> {
    return Promise.resolve({} as AuthResponse);
  }
}
