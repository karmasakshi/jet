import { Inject, Injectable } from '@angular/core';
import { IS_LOGGING_ENABLED } from '@jet/tokens/is-logging-enabled.token';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  public constructor(
    @Inject(IS_LOGGING_ENABLED)
    private readonly _isLoggingEnabled: boolean,
  ) {
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
      console.debug(`${directiveName} initialized.`);
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
