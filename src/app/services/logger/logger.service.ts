import { Inject, Injectable } from '@angular/core';
import { IS_LOGGING_ENABLED_TOKEN } from '@jet/tokens/is-logging-enabled.token';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly _isLoggingEnabled: boolean;

  public constructor(
    @Inject(IS_LOGGING_ENABLED_TOKEN)
    private readonly _isLoggingEnabledToken: boolean,
  ) {
    this._isLoggingEnabled = this._isLoggingEnabledToken;

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
