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
    try {
      window.localStorage.clear();
    } catch (error) {
      this._loggerService.logError(error);
    }
  }

  public clearSessionStorage(): void {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      this._loggerService.logError(error);
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
    } catch (error) {
      this._loggerService.logError(error);
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
    } catch (error) {
      this._loggerService.logError(error);
    }

    return value;
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    try {
      window.localStorage.removeItem(this._prefix + localStorageKey);
    } catch (error) {
      this._loggerService.logError(error);
    }
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    try {
      window.sessionStorage.removeItem(this._prefix + sessionStorageKey);
    } catch (error) {
      this._loggerService.logError(error);
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
