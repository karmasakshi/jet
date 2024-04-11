/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockLoggerService {
  // @ts-expect-error: noUnusedParameters
  logComponentInitialization(componentName: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  logError(error: unknown): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  logMessage(message: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  logServiceInitialization(serviceName: string): void {
    // Mock implementation, do nothing
  }
}
