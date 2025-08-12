/* eslint-disable @typescript-eslint/no-unused-vars */

export class AnalyticsServiceMock {
  public logEvent(
    _eventName: string,
    _eventData?: Record<string, boolean | null | number | string | undefined>,
  ): void {
    // Do nothing
  }
}
