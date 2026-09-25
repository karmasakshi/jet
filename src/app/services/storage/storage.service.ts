import { inject, Service } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import store2, { StoreType } from 'store2';
import { LoggerService } from '../logger/logger.service';

@Service()
export class StorageService {
  readonly #loggerService = inject(LoggerService);

  readonly #store2: StoreType;

  public constructor() {
    this.#store2 = store2.namespace(import.meta.env.NG_APP_APP_ID);

    this.#loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    localStorage.clear();
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    return this.#store2.get(localStorageKey);
  }

  public getSessionStorageItem<T>(sessionStorageKey: SessionStorageKey): null | T {
    return this.#store2.session.get(sessionStorageKey);
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    return this.#store2.remove(localStorageKey);
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    return this.#store2.session.remove(sessionStorageKey);
  }

  public setLocalStorageItem(localStorageKey: LocalStorageKey, value: unknown): void {
    return this.#store2.set(localStorageKey, value);
  }

  public setSessionStorageItem(sessionStorageKey: SessionStorageKey, value: unknown): void {
    return this.#store2.session.set(sessionStorageKey, value);
  }
}
