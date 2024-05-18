/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockLoggerService {
  // @ts-expect-error: noUnusedParameters
  public logComponentInitialization(componentName: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public logDirectiveInitialization(directiveName: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public logError(error: unknown): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public logMessages(messages: unknown[]): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public logServiceInitialization(serviceName: string): void {
    // Mock implementation, do nothing
  }

  // @ts-expect-error: noUnusedParameters
  public logWarning(warning: string): void {
    // Mock implementation, do nothing
  }
}
