import { DOCUMENT, inject, Service } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Service()
export class ShareService {
  readonly #navigator = inject(DOCUMENT).defaultView?.navigator;
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logServiceInitialization('ShareService');
  }

  public get isSupported(): boolean {
    return (
      typeof this.#navigator?.share === 'function' && typeof this.#navigator.canShare === 'function'
    );
  }

  public canShare(data: ShareData): boolean {
    const navigator = this.#navigator;
    return (
      typeof navigator?.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare(data)
    );
  }

  public async share(data: ShareData): Promise<void> {
    const navigator = this.#navigator;
    if (typeof navigator?.share !== 'function') {
      throw new DOMException('Native sharing is unavailable.', 'NotSupportedError');
    }

    try {
      await navigator.share(data);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        throw error;
      }
    }
  }
}
