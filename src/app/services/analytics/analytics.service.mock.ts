/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnalyticsEvent } from '@jet/interfaces/analytics-event.interface';

export class AnalyticsServiceMock {
  public logAnalyticsEvent({ data: _data, name: _name }: AnalyticsEvent): void {
    // Do nothing
  }
}
