import { inject, Service } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import { LoggerService } from '../logger/logger.service';

@Service()
export class StorageService {
  readonly #loggerService = inject(LoggerService);

  readonly #namespace = `${import.meta.env.NG_APP_APP_ID}`;

  public constructor() {
    this.#loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    return this.#getItem<T>(localStorage, localStorageKey);
  }

  public getSessionStorageItem<T>(sessionStorageKey: SessionStorageKey): null | T {
    return this.#getItem<T>(sessionStorage, sessionStorageKey);
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    localStorage.removeItem(this.#getKey(localStorageKey));
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    sessionStorage.removeItem(this.#getKey(sessionStorageKey));
  }

  public setLocalStorageItem(localStorageKey: LocalStorageKey, value: unknown): void {
    this.#setItem(localStorage, localStorageKey, value);
  }

  public setSessionStorageItem(sessionStorageKey: SessionStorageKey, value: unknown): void {
    this.#setItem(sessionStorage, sessionStorageKey, value);
  }

  #getKey(key: LocalStorageKey | SessionStorageKey): string {
    return `${this.#namespace}.${key}`;
  }

  #getItem<T>(storage: Storage, key: LocalStorageKey | SessionStorageKey): null | T {
    const value = storage.getItem(this.#getKey(key));

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  #setItem(storage: Storage, key: LocalStorageKey | SessionStorageKey, value: unknown): void {
    storage.setItem(this.#getKey(key), JSON.stringify(value));
  }
}
