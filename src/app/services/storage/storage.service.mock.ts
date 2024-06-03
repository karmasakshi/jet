/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockStorageService {
  public clearLocalStorage(): void {
    // Mock implementation, do nothing
  }

  public clearSessionStorage(): void {
    // Mock implementation, do nothing
  }

  public getLocalStorageItem<T>(_key: string): null | T {
    return null; // Mock implementation, always return null
  }

  public getSessionStorageItem<T>(_key: string): null | T {
    return null; // Mock implementation, always return null
  }

  public setLocalStorageItem(_key: string, _value: unknown): void {
    // Mock implementation, do nothing
  }

  public setSessionStorageItem(_key: string, _value: unknown): void {
    // Mock implementation, do nothing
  }

  public removeLocalStorageItem(_key: string): void {
    // Mock implementation, do nothing
  }

  public removeSessionStorageItem(_key: string): void {
    // Mock implementation, do nothing
  }
}
