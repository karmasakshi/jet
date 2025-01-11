/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthSession,
  AuthTokenResponsePassword,
  OAuthResponse,
  User,
  UserAttributes,
  UserResponse,
} from '@supabase/supabase-js';

export class UserServiceMock {
  private readonly _user: WritableSignal<User | null>;

  public constructor() {
    this._user = signal(null);
  }

  public get user(): Signal<User | null> {
    return this._user.asReadonly();
  }

  public getSession(): Promise<
    | { data: { session: AuthSession }; error: null }
    | { data: { session: null }; error: AuthError }
    | { data: { session: null }; error: null }
  > {
    return Promise.resolve({
      data: { session: {} as AuthSession },
      error: null,
    });
  }

  public resetPasswordForEmail(
    _email: string,
  ): Promise<{ data: object; error: null } | { data: null; error: AuthError }> {
    return Promise.resolve({ data: {}, error: null });
  }

  public signInWithOauth(
    _oauthProvider: AvailableOauthProvider,
  ): Promise<OAuthResponse> {
    return Promise.resolve({} as OAuthResponse);
  }

  public signInWithOtp(_email: string): Promise<AuthOtpResponse> {
    return Promise.resolve({} as AuthOtpResponse);
  }

  public signInWithPassword(
    _email: string,
    _password: string,
  ): Promise<AuthTokenResponsePassword> {
    return Promise.resolve({} as AuthTokenResponsePassword);
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return Promise.resolve({ error: null });
  }

  public signUp(_email: string, _password: string): Promise<AuthResponse> {
    return Promise.resolve({} as AuthResponse);
  }

  public updateUser(_userAttributes: UserAttributes): Promise<UserResponse> {
    return Promise.resolve({} as UserResponse);
  }
}
