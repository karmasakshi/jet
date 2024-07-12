import { Injectable } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _prefix: string;

  public constructor(private readonly _loggerService: LoggerService) {
    this._prefix = 'jet';

    this._loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    let value: null | T = null;

    const serializedValue = localStorage.getItem(
      `${this._prefix}-${localStorageKey}`,
    );

    if (serializedValue) {
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

    const serializedValue = sessionStorage.getItem(
      `${this._prefix}-${sessionStorageKey}`,
    );

    if (serializedValue) {
      try {
        value = JSON.parse(serializedValue) as T;
      } catch (error: unknown) {
        this._loggerService.logError(error);
      }
    }

    return value;
  }

  public setLocalStorageItem(
    localStorageKey: LocalStorageKey,
    value: unknown,
  ): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      localStorage.setItem(
        `${this._prefix}-${localStorageKey}`,
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

      sessionStorage.setItem(
        `${this._prefix}-${sessionStorageKey}`,
        serializedValue,
      );
    } catch (error: unknown) {
      this._loggerService.logError(error);
    }
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    localStorage.removeItem(`${this._prefix}-${localStorageKey}`);
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    sessionStorage.removeItem(`${this._prefix}-${sessionStorageKey}`);
  }
}
