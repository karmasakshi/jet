import { Directive, HostListener, InputSignal, input } from '@angular/core';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

@Directive({
  selector: '[jetAnalytics]',
  standalone: true,
})
export class AnalyticsDirective {
  public jetAnalyticsEventData: InputSignal<unknown> = input();
  public jetAnalyticsEventName: InputSignal<string> = input.required();

  public constructor(
    private readonly _analyticsService: AnalyticsService,
    private readonly _loggerService: LoggerService,
  ) {
    this._loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click') public logClick(): void {
    this._analyticsService.logEvent(
      this.jetAnalyticsEventName(),
      this.jetAnalyticsEventData(),
    );
  }
}
