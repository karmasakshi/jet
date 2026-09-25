import { inject, Service } from '@angular/core';
import { IS_ANALYTICS_ENABLED } from '@jet/injection-tokens/is-analytics-enabled.injection-token';
import { AnalyticsEvent } from '@jet/interfaces/analytics-event.interface';
import { gtag, install } from 'ga-gtag';
import { LoggerService } from '../logger/logger.service';

@Service()
export class AnalyticsService {
  readonly #isAnalyticsEnabled = inject(IS_ANALYTICS_ENABLED);
  readonly #loggerService = inject(LoggerService);

  readonly #googleAnalyticsMeasurementId: string;

  public constructor() {
    this.#googleAnalyticsMeasurementId = import.meta.env.NG_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID;

    if (this.#isAnalyticsEnabled) {
      install(this.#googleAnalyticsMeasurementId);
    }

    this.#loggerService.logServiceInitialization('AnalyticsService');
  }

  public logAnalyticsEvent({ data, name }: AnalyticsEvent): void {
    if (this.#isAnalyticsEnabled) {
      gtag('event', name, data as Gtag.CustomParams);
    }
  }
}
