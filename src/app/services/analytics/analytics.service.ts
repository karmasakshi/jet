import { Injectable, inject } from '@angular/core';
import { IS_ANALYTICS_ENABLED } from '@jet/tokens/is-analytics-enabled.token';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly _isAnalyticsEnabled = inject(IS_ANALYTICS_ENABLED);
  private readonly _loggerService = inject(LoggerService);

  public constructor() {
    this._loggerService.logServiceInitialization('AnalyticsService');
  }

  public logEvent(eventName: string, eventData?: unknown): void {
    if (this._isAnalyticsEnabled) {
      if (eventData) {
        this._loggerService.logMessages(eventName, eventData);
      } else {
        this._loggerService.logMessages(eventName);
      }
    }
  }
}
