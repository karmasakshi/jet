import { Injectable, isDevMode } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly _isAnalyticsEnabled: boolean;

  public constructor(private readonly _loggerService: LoggerService) {
    this._isAnalyticsEnabled = !isDevMode();

    this._loggerService.logServiceInitialization('AnalyticsService');
  }

  public track(eventName: string, eventData?: string): void {
    if (this._isAnalyticsEnabled) {
      eventData
        ? this._loggerService.logMessages(eventName, eventData)
        : this._loggerService.logMessages(eventName);
    }
  }
}
