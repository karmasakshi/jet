import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { User } from '@jet/interfaces/user.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _user: WritableSignal<User | null>;

  public constructor() {
    this._user = signal(null);

    this._loggerService.logServiceInitialization('AuthenticationService');
  }

  public get user(): Signal<User | null> {
    return this._user.asReadonly();
  }

  public getUser(): Promise<User | null> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this._user());
      }, 900);
    });
  }

  public signIn(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        this._user.set({});
        resolve();
      }, 900);
    });
  }

  public signOut(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        this._user.set(null);
        resolve();
      }, 900);
    });
  }
}
