import { Directive, HostListener, Input } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';

@Directive({
  selector: '[jetAnalytics]',
  standalone: true,
})
export class AnalyticsDirective {
  @Input({ required: true }) public jetAnalyticsEventName: string | undefined;
  @Input() public jetAnalyticsEventData: undefined | { [key: string]: unknown };

  public constructor(private readonly _loggerService: LoggerService) {
    this.jetAnalyticsEventName = undefined;

    this.jetAnalyticsEventData = undefined;

    this._loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click') public onClick(): void {
    this._trackEvent(this.jetAnalyticsEventName, this.jetAnalyticsEventData);
  }

  private _trackEvent(
    eventName: string | undefined,
    eventData: undefined | { [key: string]: unknown },
  ): void {
    if (eventName) {
      eventData
        ? this._loggerService.logMessages(eventName, eventData)
        : this._loggerService.logMessages(eventName);
    }
  }
}
