import { inject, Injectable } from '@angular/core';
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from '@jet/injection-tokens/google-analytics-measurement-id.injection-token';
import { IS_ANALYTICS_ENABLED } from '@jet/injection-tokens/is-analytics-enabled.injection-token';
import { gtag, install } from 'ga-gtag';
import { LoggerService } from '../logger/logger.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  readonly #googleAnalyticsMeasurementId = inject(
    GOOGLE_ANALYTICS_MEASUREMENT_ID,
  );
  readonly #isAnalyticsEnabled = inject(IS_ANALYTICS_ENABLED);
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    if (this.#isAnalyticsEnabled) {
      install(this.#googleAnalyticsMeasurementId);
    }

    this.#loggerService.logServiceInitialization('AnalyticsService');
  }

  public logEvent(
    eventName: string,
    eventData?: Record<string, boolean | null | number | string | undefined>,
  ): void {
    if (!this.#isAnalyticsEnabled) {
      return;
    }

    gtag('event', eventName, eventData as Gtag.CustomParams);
  }
}
