/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockAnalyticsService {
  public track(
    // @ts-expect-error: noUnusedParameters
    eventName: string,
    // @ts-expect-error: noUnusedParameters
    eventData?: string,
  ): void {
    // Mock implementation, do nothing
  }
}
