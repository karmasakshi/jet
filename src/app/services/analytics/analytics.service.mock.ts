/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnalyticsEvent } from '@jet/interfaces/analytics-event.interface';

export class AnalyticsServiceMock {
  public logEvent(_analyticsEvent: AnalyticsEvent): void {
    // Do nothing
  }
}
