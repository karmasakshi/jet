/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockStorageService {
  public clearLocalStorage(): void {
    // Mock implementation, do nothing
  }

  public clearSessionStorage(): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public getLocalStorageItem<T>(key: string): null | T {
    return null; // Mock implementation, always return null
  }

  // @ts-expect-error: noUnusedParameters
  public getSessionStorageItem<T>(key: string): null | T {
    return null; // Mock implementation, always return null
  }

  // @ts-expect-error: noUnusedParameters
  public setLocalStorageItem(key: string, value: unknown): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public setSessionStorageItem(key: string, value: unknown): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public removeLocalStorageItem(key: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public removeSessionStorageItem(key: string): void {
    // Mock implementation, do nothing
  }
}
