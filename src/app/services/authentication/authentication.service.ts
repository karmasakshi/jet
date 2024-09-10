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

  public login(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      try {
        window.setTimeout(() => {
          this._user.set({});
          resolve();
        }, 1800);
      } catch (error) {
        this._loggerService.logError(error);
        reject(new Error());
      }
    });
  }

  public logout(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      try {
        window.setTimeout(() => {
          this._user.set(null);
          resolve();
        }, 1800);
      } catch (error) {
        this._loggerService.logError(error);
        reject(new Error());
      }
    });
  }
}
