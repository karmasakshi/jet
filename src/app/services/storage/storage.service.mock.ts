/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockStorageService {
  clearLocalStorage(): void {
    // Mock implementation, do nothing
  }

  clearSessionStorage(): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  getLocalStorageItem<T>(key: string): null | T {
    return null; // Mock implementation, always return null
  }

  // @ts-expect-error: noUnusedParameters
  getSessionStorageItem<T>(key: string): null | T {
    return null; // Mock implementation, always return null
  }

  // @ts-expect-error: noUnusedParameters
  setLocalStorageItem(key: string, value: unknown): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  setSessionStorageItem(key: string, value: unknown): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  removeLocalStorageItem(key: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  removeSessionStorageItem(key: string): void {
    // Mock implementation, do nothing
  }
}
