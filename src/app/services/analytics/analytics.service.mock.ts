/* eslint-disable @typescript-eslint/no-unused-vars */

export class AnalyticsServiceMock {
  public logEvent(
    _eventName: string,
    _eventData?: Record<string, string | number | boolean | null | undefined>,
  ): void {
    // Do nothing
  }
}
