import {
  Directive,
  HostListener,
  InputSignal,
  inject,
  input,
} from '@angular/core';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

@Directive({
  selector: '[jetAnalytics]',
  standalone: true,
})
export class AnalyticsDirective {
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);

  public jetAnalyticsEventData: InputSignal<unknown> = input();
  public jetAnalyticsEventName: InputSignal<string> = input.required();

  public constructor() {
    this._loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click') public logClick(): void {
    this._analyticsService.logEvent(
      this.jetAnalyticsEventName(),
      this.jetAnalyticsEventData(),
    );
  }
}
