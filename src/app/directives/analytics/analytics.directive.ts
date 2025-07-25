import {
  Directive,
  HostListener,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

interface AnalyticsEvent {
  name: string;
  data?: unknown;
}

@Directive({ selector: '[jetAnalytics]' })
export class AnalyticsDirective {
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);

  public readonly jetAnalytics: InputSignal<AnalyticsEvent> = input.required();

  public constructor() {
    this._loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click')
  public logClick(): void {
    const { data, name } = this.jetAnalytics();
    this._analyticsService.logEvent(name, data);
  }
}
