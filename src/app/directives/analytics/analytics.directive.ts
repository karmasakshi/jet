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
  data?: Record<string, boolean | null | number | string | undefined>;
  name: string;
}

@Directive({ selector: '[jetAnalytics]' })
export class AnalyticsDirective {
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);

  public readonly jetAnalytics: InputSignal<AnalyticsEvent> = input.required();

  public constructor() {
    this.#loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click')
  public logClick(): void {
    const { data, name } = this.jetAnalytics();
    this.#analyticsService.logEvent(name, data);
  }
}
