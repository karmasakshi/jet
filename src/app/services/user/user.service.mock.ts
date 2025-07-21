/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';
import { AvailableOauthProvider } from '@jet/types/available-oauth-provider.type';
import {
  AuthError,
  AuthOtpResponse,
  AuthResponse,
  AuthTokenResponsePassword,
  JwtHeader,
  JwtPayload,
  OAuthResponse,
  User,
  UserAttributes,
  UserResponse,
} from '@supabase/supabase-js';

export class UserServiceMock {
  private readonly _user: WritableSignal<null | User>;

  public constructor() {
    this._user = signal(null);
  }

  public get user(): Signal<null | User> {
    return this._user.asReadonly();
  }

  public getClaims(): Promise<
    | {
        data: { claims: JwtPayload; header: JwtHeader; signature: Uint8Array };
        error: null;
      }
    | { data: null; error: AuthError }
    | { data: null; error: null }
  > {
    return Promise.resolve({
      data: {
        claims: {} as JwtPayload,
        header: {} as JwtHeader,
        signature: {} as Uint8Array,
      },
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

  public signOut(): Promise<{ error: null | AuthError }> {
    return Promise.resolve({ error: null });
  }

  public signUp(_email: string, _password: string): Promise<AuthResponse> {
    return Promise.resolve({} as AuthResponse);
  }

  public updateUser(_userAttributes: UserAttributes): Promise<UserResponse> {
    return Promise.resolve({} as UserResponse);
  }
}
