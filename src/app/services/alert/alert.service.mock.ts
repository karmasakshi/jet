/* eslint-disable @typescript-eslint/no-unused-vars */

export class MockAlertService {
  // @ts-expect-error: noUnusedParameters
  public showAlert(message: string, cta?: string, action?: () => void): void {
    // Mock implementation, do nothing
  }
}
