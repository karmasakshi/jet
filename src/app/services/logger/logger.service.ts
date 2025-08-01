/* eslint-disable no-console */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  readonly #isLoggingEnabled: boolean;

  public constructor() {
    this.#isLoggingEnabled =
      import.meta.env.NG_APP_IS_LOGGING_ENABLED === 'true';

    this.logServiceInitialization('LoggerService');
  }

  public log(...args: unknown[]): void {
    if (this.#isLoggingEnabled) {
      console.log(...args);
    }
  }

  public logClassInitialization(className: string): void {
    if (this.#isLoggingEnabled) {
      console.info(`Class ${className} initialized.`);
    }
  }

  public logComponentInitialization(componentName: string): void {
    if (this.#isLoggingEnabled) {
      console.debug(`Component ${componentName} initialized.`);
    }
  }

  public logDirectiveInitialization(directiveName: string): void {
    if (this.#isLoggingEnabled) {
      console.debug(`Directive ${directiveName} initialized.`);
    }
  }

  public logEffectRun(signalName: string): void {
    if (this.#isLoggingEnabled) {
      console.warn(`Running effect for ${signalName}.`);
    }
  }

  public logError(error: Error): void {
    if (this.#isLoggingEnabled) {
      console.error(error);
    }
  }

  public logException(exception: unknown): void {
    if (this.#isLoggingEnabled) {
      console.error(exception);
    }
  }

  public logServiceInitialization(serviceName: string): void {
    if (this.#isLoggingEnabled) {
      console.info(`Service ${serviceName} initialized.`);
    }
  }

  public logWarning(warning: string): void {
    if (this.#isLoggingEnabled) {
      console.warn(warning);
    }
  }
}
