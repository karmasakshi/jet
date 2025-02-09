import { Injectable, inject } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _prefix: string;

  public constructor() {
    this._prefix = 'jet-';

    this._loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    try {
      Object.values(LocalStorageKey).forEach((key) => {
        window.localStorage.removeItem(this._prefix + key);
      });
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }
  }

  public clearSessionStorage(): void {
    try {
      Object.values(SessionStorageKey).forEach((key) => {
        window.sessionStorage.removeItem(this._prefix + key);
      });
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    let value: null | T = null;

    try {
      const serializedValue: string | null = window.localStorage.getItem(
        this._prefix + localStorageKey,
      );

      if (serializedValue !== null) {
        value = JSON.parse(serializedValue) as T;
      }
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }

    return value;
  }

  public getSessionStorageItem<T>(
    sessionStorageKey: SessionStorageKey,
  ): null | T {
    let value: null | T = null;

    try {
      const serializedValue: string | null = window.sessionStorage.getItem(
        this._prefix + sessionStorageKey,
      );

      if (serializedValue !== null) {
        value = JSON.parse(serializedValue) as T;
      }
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }

    return value;
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    try {
      window.localStorage.removeItem(this._prefix + localStorageKey);
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    try {
      window.sessionStorage.removeItem(this._prefix + sessionStorageKey);
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }
  }

  public setLocalStorageItem(
    localStorageKey: LocalStorageKey,
    value: unknown,
  ): void {
    try {
      const serializedValue: string = JSON.stringify(value);
      window.localStorage.setItem(
        this._prefix + localStorageKey,
        serializedValue,
      );
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }
  }

  public setSessionStorageItem(
    sessionStorageKey: SessionStorageKey,
    value: unknown,
  ): void {
    try {
      const serializedValue: string = JSON.stringify(value);
      window.sessionStorage.setItem(
        this._prefix + sessionStorageKey,
        serializedValue,
      );
    } catch (exception: unknown) {
      this._loggerService.logException(exception);
    }
  }
}
