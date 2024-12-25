/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';
import { User } from '@jet/interfaces/user.interface';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import {
  AuthError,
  AuthResponse,
  AuthSession,
  AuthTokenResponsePassword,
  OAuthResponse,
  Session,
  User as SupabaseUser,
  WeakPassword,
} from '@supabase/supabase-js';

export class AuthenticationServiceMock {
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
    return Promise.resolve({ data: { session: null }, error: null });
  }

  public resetPassword(
    _email: string,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ): Promise<{ data: {}; error: null } | { data: null; error: AuthError }> {
    return Promise.resolve({ data: {}, error: null });
  }

  public signInWithOauth(
    oauthProvider: AvailableOauthProvider,
  ): Promise<OAuthResponse> {
    return Promise.resolve({
      data: {
        provider: oauthProvider,
        url: '',
      },
      error: null,
    });
  }

  public signIn(
    _email: string,
    _password: string,
  ): Promise<AuthTokenResponsePassword> {
    return Promise.resolve({
      data: {
        session: {} as Session,
        user: {} as SupabaseUser,
        weakPassword: {} as WeakPassword,
      },
      error: null,
    });
  }

  public signOut(): Promise<{ error: AuthError | null }> {
    return Promise.resolve({ error: null });
  }

  public signUp(_email: string, _password: string): Promise<AuthResponse> {
    return Promise.resolve({
      data: {
        session: null,
        user: null,
      },
      error: null,
    });
  }
}
