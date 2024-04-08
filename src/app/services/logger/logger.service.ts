import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

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

  public logError(error: unknown | Error): void {
    if (this._isLoggingEnabled) {
      console.error(error);
    }
  }

  public logMessage(message: string): void {
    if (this._isLoggingEnabled) {
      console.log(message);
    }
  }

  public logServiceInitialization(serviceName: string): void {
    if (this._isLoggingEnabled) {
      console.warn(`${serviceName} initialized.`);
    }
  }

  public logComponentInitialization(componentName: string): void {
    if (this._isLoggingEnabled) {
      console.info(`${componentName} initialized.`);
    }
  }
}
