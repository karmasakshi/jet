/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockLoggerService {
  public logComponentInitialization(_componentName: string): void {
    // Mock implementation, do nothing
  }

  public logDirectiveInitialization(_directiveName: string): void {
    // Mock implementation, do nothing
  }

  public logError(_error: unknown): void {
    // Mock implementation, do nothing
  }

  public logMessages(_messages: unknown[]): void {
    // Mock implementation, do nothing
  }

  public logServiceInitialization(_serviceName: string): void {
    // Mock implementation, do nothing
  }

  public logWarning(_warning: string): void {
    // Mock implementation, do nothing
  }
}
