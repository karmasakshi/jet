import {
  Directive,
  HostListener,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

interface JetAnalyticsEvent {
  name: string;
  data?: unknown;
}

@Directive({ selector: '[jetAnalytics]' })
export class Analytics {
  private readonly _analyticsService = inject(AnalyticsService);
  private readonly _loggerService = inject(LoggerService);

  public readonly jetAnalytics: InputSignal<JetAnalyticsEvent> =
    input.required();

  public constructor() {
    this._loggerService.logDirectiveInitialization('Analytics');
  }

  @HostListener('click')
  public logClick(): void {
    const { data, name } = this.jetAnalytics();
    this._analyticsService.logEvent(name, data);
  }
}
