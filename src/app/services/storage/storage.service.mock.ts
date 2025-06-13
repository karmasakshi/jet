/* eslint-disable @typescript-eslint/no-unused-vars */

import { LocalStorageKey } from '@jet/enums/local-storage-key.enum';
import { SessionStorageKey } from '@jet/enums/session-storage-key.enum';

export class StorageServiceMock {
  public clearLocalStorage(): void {
    // Do nothing
  }

  public clearSessionStorage(): void {
    // Do nothing
  }

  public getLocalStorageItem<T>(_localStorageKey: LocalStorageKey): null | T {
    return null;
  }

  public getSessionStorageItem<T>(
    _sessionStorageKey: SessionStorageKey,
  ): null | T {
    return null;
  }

  public removeLocalStorageItem(_localStorageKey: LocalStorageKey): void {
    // Do nothing
  }

  public removeSessionStorageItem(_sessionStorageKey: SessionStorageKey): void {
    // Do nothing
  }

  public setLocalStorageItem(
    _localStorageKey: LocalStorageKey,
    _value: unknown,
  ): void {
    // Do nothing
  }

  public setSessionStorageItem(
    _sessionStorageKey: SessionStorageKey,
    _value: unknown,
  ): void {
    // Do nothing
  }
}
