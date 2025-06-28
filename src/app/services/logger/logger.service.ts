import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly _isLoggingEnabled: boolean;

  public constructor() {
    this._isLoggingEnabled =
      import.meta.env.NG_APP_IS_LOGGING_ENABLED === 'true';

    this.logServiceInitialization('LoggerService');
  }

  public log(...args: unknown[]): void {
    this._logIfEnabled(() => console.log(...args));
  }

  public logClassInitialization(className: string): void {
    this._logIfEnabled(() => console.info(`Class ${className} initialized.`));
  }

  public logComponentInitialization(componentName: string): void {
    this._logIfEnabled(() =>
      console.debug(`Component ${componentName} initialized.`),
    );
  }

  public logDirectiveInitialization(directiveName: string): void {
    this._logIfEnabled(() =>
      console.debug(`Directive ${directiveName} initialized.`),
    );
  }

  public logEffectRun(signalName: string): void {
    this._logIfEnabled(() => console.warn(`Running effect for ${signalName}.`));
  }

  public logError(error: Error): void {
    this._logIfEnabled(() => console.error(error));
  }

  public logException(exception: unknown): void {
    this._logIfEnabled(() => console.error(exception));
  }

  public logServiceInitialization(serviceName: string): void {
    this._logIfEnabled(() =>
      console.info(`Service ${serviceName} initialized.`),
    );
  }

  public logWarning(warning: string): void {
    this._logIfEnabled(() => console.warn(warning));
  }

  private _logIfEnabled(logFunction: () => void): void {
    if (this._isLoggingEnabled) {
      logFunction();
    }
  }
}
