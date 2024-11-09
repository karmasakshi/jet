import { Injectable, inject } from '@angular/core';
import { IS_LOGGING_ENABLED } from '@jet/tokens/is-logging-enabled.token';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly _isLoggingEnabled = inject(IS_LOGGING_ENABLED);

  public constructor() {
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
      console.info(`Service ${serviceName} initialized.`);
    }
  }

  public logWarning(warning: string): void {
    if (this._isLoggingEnabled) {
      console.warn(warning);
    }
  }
}
