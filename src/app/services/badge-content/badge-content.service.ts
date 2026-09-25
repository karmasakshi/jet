import { inject, Service } from '@angular/core';
import { Badge } from '@jet/types/badge.type';
import { LoggerService } from '../logger/logger.service';

@Service()
export class BadgeContentService {
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    this.#loggerService.logServiceInitialization('BadgeContentService');
  }

  public getBadgeContent(badge: Badge | null): null | string {
    switch (badge) {
      default:
        return null;
    }
  }
}
