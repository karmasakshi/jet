/* eslint-disable no-console */

import { inject, Service } from '@angular/core';
import { IS_LOGGING_ENABLED } from '@jet/injection-tokens/is-logging-enabled.injection-token';

@Service()
export class LoggerService {
  readonly #isLoggingEnabled = inject(IS_LOGGING_ENABLED);

  public constructor() {
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

  public logEffectRun(...signalNames: string[]): void {
    if (this.#isLoggingEnabled) {
      console.warn(`Running effect for ${signalNames.join(', ')}.`);
    }
  }

  public logException(exception: unknown): void {
    if (this.#isLoggingEnabled) {
      console.error(exception);
    }
  }

  public logServiceInitialization(serviceName: string): void {
    if (this.#isLoggingEnabled) {
      console.warn(`Service ${serviceName} initialized.`);
    }
  }
}
