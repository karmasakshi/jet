/* eslint-disable no-console */

import { inject, Injectable } from '@angular/core';
import { IS_LOGGING_ENABLED } from '@jet/injection-tokens/is-logging-enabled.injection-token';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  readonly #isLoggingEnabled = inject(IS_LOGGING_ENABLED);

  public constructor() {
    this.logServiceInitialization('LoggerService');
  }

  public log(...args: unknown[]): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.log(...args);
  }

  public logClassInitialization(className: string): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.info(`Class ${className} initialized.`);
  }

  public logComponentInitialization(componentName: string): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.debug(`Component ${componentName} initialized.`);
  }

  public logDirectiveInitialization(directiveName: string): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.debug(`Directive ${directiveName} initialized.`);
  }

  public logEffectRun(signalName: string): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.warn(`Running effect for ${signalName}.`);
  }

  public logError(error: Error): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.error(error);
  }

  public logException(exception: unknown): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.error(exception);
  }

  public logServiceInitialization(serviceName: string): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.info(`Service ${serviceName} initialized.`);
  }

  public logWarning(warning: string): void {
    if (!this.#isLoggingEnabled) {
      return;
    }

    console.warn(warning);
  }
}
