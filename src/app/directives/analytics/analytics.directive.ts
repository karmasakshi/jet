import { Directive, HostListener, Input } from '@angular/core';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

@Directive({
  selector: '[jetAnalytics]',
  standalone: true,
})
export class AnalyticsDirective {
  @Input() public jetAnalyticsEventData: unknown;
  @Input({ required: true }) public jetAnalyticsEventName: string | undefined;

  public constructor(
    private readonly _analyticsService: AnalyticsService,
    private readonly _loggerService: LoggerService,
  ) {
    this.jetAnalyticsEventData = undefined;

    this.jetAnalyticsEventName = undefined;

    this._loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click') public logClick(): void {
    if (this.jetAnalyticsEventName) {
      this._analyticsService.logEvent(
        this.jetAnalyticsEventName,
        this.jetAnalyticsEventData,
      );
    }
  }
}
