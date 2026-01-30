import { inject, Injectable } from '@angular/core';
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from '@jet/injection-tokens/google-analytics-measurement-id.injection-token';
import { IS_ANALYTICS_ENABLED } from '@jet/injection-tokens/is-analytics-enabled.injection-token';
import { AnalyticsEvent } from '@jet/interfaces/analytics-event.interface';
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

  public logEvent(analyticsEvent: AnalyticsEvent): void {
    if (!this.#isAnalyticsEnabled) {
      return;
    }

    gtag(
      'event',
      analyticsEvent.name,
      analyticsEvent.data as Gtag.CustomParams,
    );
  }
}
