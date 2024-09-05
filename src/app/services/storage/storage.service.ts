import { Injectable, inject } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _prefix: string;

  public constructor() {
    this._prefix = 'jet-';

    this._loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    window.localStorage.clear();
  }

  public clearSessionStorage(): void {
    window.sessionStorage.clear();
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    let value: null | T = null;

    const serializedValue: string | null = window.localStorage.getItem(
      this._prefix + localStorageKey,
    );

    if (serializedValue !== null) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error: unknown) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public getSessionStorageItem<T>(
    sessionStorageKey: SessionStorageKey,
  ): null | T {
    let value: null | T = null;

    const serializedValue: string | null = window.sessionStorage.getItem(
      this._prefix + sessionStorageKey,
    );

    if (serializedValue !== null) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error: unknown) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    window.localStorage.removeItem(this._prefix + localStorageKey);
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    window.sessionStorage.removeItem(this._prefix + sessionStorageKey);
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
    } catch (error: unknown) {
      this._loggerService.logError(error);
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
    } catch (error: unknown) {
      this._loggerService.logError(error);
    }
  }
}
