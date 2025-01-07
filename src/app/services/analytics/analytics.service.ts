import { Injectable, inject } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _isAnalyticsEnabled: boolean;

  public constructor() {
    this._isAnalyticsEnabled =
      import.meta.env.NG_APP_IS_ANALYTICS_ENABLED === 'true';

    this._loggerService.logServiceInitialization('AnalyticsService');
  }

  public logEvent(
    eventName: string,
    eventData?: Record<string, string | number | boolean | null | undefined>,
  ): void {
    if (!this._isAnalyticsEnabled) {
      return;
    }

    if (eventData === undefined) {
      this._loggerService.logMessages(eventName);
    } else {
      this._loggerService.logMessages(eventName, JSON.stringify(eventData));
    }
  }
}
