import { inject, Injectable } from '@angular/core';
import { gtag, install } from 'ga-gtag';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  readonly #loggerService = inject(LoggerService);

  readonly #googleAnalyticsMeasurementId: string;
  readonly #isAnalyticsEnabled: boolean;

  public constructor() {
    this.#googleAnalyticsMeasurementId =
      import.meta.env.NG_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID;

    this.#isAnalyticsEnabled =
      import.meta.env.NG_APP_IS_ANALYTICS_ENABLED === 'true';

    if (this.#isAnalyticsEnabled) {
      install(this.#googleAnalyticsMeasurementId);
    }

    this.#loggerService.logServiceInitialization('AnalyticsService');
  }

  public logEvent(eventName: string, eventData?: unknown): void {
    if (!this.#isAnalyticsEnabled) {
      return;
    }

    gtag('event', eventName, eventData as Gtag.CustomParams);
  }
}
