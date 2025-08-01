import { inject, Injectable } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly #loggerService = inject(LoggerService);

  readonly #prefix: string;

  public constructor() {
    this.#prefix = 'jet-';

    this.#loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    try {
      Object.values(LocalStorageKey).forEach((key) => {
        window.localStorage.removeItem(this.#prefix + key);
      });
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }
  }

  public clearSessionStorage(): void {
    try {
      Object.values(SessionStorageKey).forEach((key) => {
        window.sessionStorage.removeItem(this.#prefix + key);
      });
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    let value: null | T = null;

    try {
      const serializedValue: null | string = window.localStorage.getItem(
        this.#prefix + localStorageKey,
      );

      if (serializedValue !== null) {
        value = JSON.parse(serializedValue);
      }
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }

    return value;
  }

  public getSessionStorageItem<T>(
    sessionStorageKey: SessionStorageKey,
  ): null | T {
    let value: null | T = null;

    try {
      const serializedValue: null | string = window.sessionStorage.getItem(
        this.#prefix + sessionStorageKey,
      );

      if (serializedValue !== null) {
        value = JSON.parse(serializedValue);
      }
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }

    return value;
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    try {
      window.localStorage.removeItem(this.#prefix + localStorageKey);
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    try {
      window.sessionStorage.removeItem(this.#prefix + sessionStorageKey);
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }
  }

  public setLocalStorageItem(
    localStorageKey: LocalStorageKey,
    value: unknown,
  ): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      window.localStorage.setItem(
        this.#prefix + localStorageKey,
        serializedValue,
      );
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }
  }

  public setSessionStorageItem(
    sessionStorageKey: SessionStorageKey,
    value: unknown,
  ): void {
    try {
      const serializedValue: string = JSON.stringify(value);

      window.sessionStorage.setItem(
        this.#prefix + sessionStorageKey,
        serializedValue,
      );
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
    }
  }
}
