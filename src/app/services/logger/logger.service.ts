import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly _isLoggingEnabled: boolean;

  public constructor() {
    this._isLoggingEnabled =
      import.meta.env.NG_APP_IS_LOGGING_ENABLED === 'true';

    if (this._isLoggingEnabled) {
      this.logServiceInitialization('LoggerService');
    }
  }

  public logClassInitialization(className: string): void {
    if (this._isLoggingEnabled) {
      console.info(`Class ${className} initialized.`);
    }
  }

  public logComponentInitialization(componentName: string): void {
    if (this._isLoggingEnabled) {
      console.debug(`Component ${componentName} initialized.`);
    }
  }

  public logDirectiveInitialization(directiveName: string): void {
    if (this._isLoggingEnabled) {
      console.debug(`Directive ${directiveName} initialized.`);
    }
  }

  public logError(error: Error): void {
    if (this._isLoggingEnabled) {
      console.error(error);
    }
  }

  public logException(exception: unknown): void {
    if (this._isLoggingEnabled) {
      console.error(exception);
    }
  }

  public logMessages(...messages: string[]): void {
    if (this._isLoggingEnabled) {
      console.log(...messages);
    }
  }

  public logServiceInitialization(serviceName: string): void {
    if (this._isLoggingEnabled) {
      console.info(`Service ${serviceName} initialized.`);
    }
  }

  public logWarning(warning: string): void {
    if (this._isLoggingEnabled) {
      console.warn(warning);
    }
  }
}
