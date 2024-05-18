import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly _isLoggingEnabled: boolean;

  public constructor() {
    this._isLoggingEnabled = isDevMode();

    if (this._isLoggingEnabled) {
      this.logServiceInitialization('LoggerService');
    }
  }

  public logComponentInitialization(componentName: string): void {
    if (this._isLoggingEnabled) {
      console.debug(`${componentName} initialized.`);
    }
  }

  public logDirectiveInitialization(directiveName: string): void {
    if (this._isLoggingEnabled) {
      console.info(`${directiveName} initialized.`);
    }
  }

  public logError(error: unknown): void {
    if (this._isLoggingEnabled) {
      console.error(error);
    }
  }

  public logMessages(...messages: unknown[]): void {
    if (this._isLoggingEnabled) {
      console.log(...messages);
    }
  }

  public logServiceInitialization(serviceName: string): void {
    if (this._isLoggingEnabled) {
      console.info(`${serviceName} initialized.`);
    }
  }

  public logWarning(warning: string): void {
    if (this._isLoggingEnabled) {
      console.warn(warning);
    }
  }
}
