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

  public async login(): Promise<void> {
    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(() => {
          this._user.set({} as User);
          resolve();
        }, 900);
      });
    } catch (error) {
      this._loggerService.logError(error);
      throw new Error();
    }
  }

  public async logout(): Promise<void> {
    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(() => {
          this._user.set(null);
          resolve();
        }, 900);
      });
    } catch (error) {
      this._loggerService.logError(error);
      throw new Error();
    }
  }
}
