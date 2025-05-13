/* eslint-disable @typescript-eslint/no-unused-vars */

export class LoggerServiceMock {
  public log(..._args: unknown[]): void {
    // Do nothing
  }

  public logClassInitialization(_className: string): void {
    // Do nothing
  }

  public logComponentInitialization(_componentName: string): void {
    // Do nothing
  }

  public logDirectiveInitialization(_directiveName: string): void {
    // Do nothing
  }

  public logEffectRun(_signalName: string): void {
    // Do nothing
  }

  public logError(_error: Error): void {
    // Do nothing
  }

  public logException(_exception: unknown): void {
    // Do nothing
  }

  public logServiceInitialization(_serviceName: string): void {
    // Do nothing
  }

  public logWarning(_warning: string): void {
    // Do nothing
  }
}
