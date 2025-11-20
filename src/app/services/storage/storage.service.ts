import { inject, Injectable } from '@angular/core';
import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';
import store2, { StoreType } from 'store2';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly #loggerService = inject(LoggerService);

  readonly #store2: StoreType;

  public constructor() {
    this.#store2 = store2.namespace('jet');

    this.#loggerService.logServiceInitialization('StorageService');
  }

  public clearLocalStorage(): void {
    store2.clearAll();
  }

  public clearSessionStorage(): void {
    store2.session.clearAll();
  }

  public getLocalStorageItem<T>(localStorageKey: LocalStorageKey): null | T {
    return this.#store2.get(localStorageKey);
  }

  public getSessionStorageItem<T>(
    sessionStorageKey: SessionStorageKey,
  ): null | T {
    return this.#store2.session.get(sessionStorageKey);
  }

  public removeLocalStorageItem(localStorageKey: LocalStorageKey): void {
    this.#store2.remove(localStorageKey);
  }

  public removeSessionStorageItem(sessionStorageKey: SessionStorageKey): void {
    this.#store2.session.remove(sessionStorageKey);
  }

  public setLocalStorageItem<T>(
    localStorageKey: LocalStorageKey,
    data: T,
  ): void {
    this.#store2.set(localStorageKey, data);
  }

  public setSessionStorageItem<T>(
    sessionStorageKey: SessionStorageKey,
    data: T,
  ): void {
    this.#store2.session.set(sessionStorageKey, data);
  }
}
