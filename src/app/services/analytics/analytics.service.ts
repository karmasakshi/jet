import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly _loggerService = inject(LoggerService);

  private readonly _googleAnalyticsMeasurementId: string;
  private readonly _isAnalyticsEnabled: boolean;

  public constructor() {
    this._googleAnalyticsMeasurementId =
      import.meta.env.NG_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID;

    this._isAnalyticsEnabled =
      import.meta.env.NG_APP_IS_ANALYTICS_ENABLED === 'true';

    window.gtag('config', this._googleAnalyticsMeasurementId);

    this._loggerService.logServiceInitialization('AnalyticsService');
  }

  public logEvent(eventName: string, eventData?: unknown): void {
    if (!this._isAnalyticsEnabled) {
      return;
    }

    window.gtag('event', eventName, eventData);
  }
}
