import {
  Directive,
  HostListener,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { AnalyticsEvent } from '@jet/interfaces/analytics-event.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

@Directive({ selector: '[jetAnalytics]' })
export class AnalyticsDirective {
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);

  public readonly jetAnalytics: InputSignal<AnalyticsEvent> = input.required();

  public constructor() {
    this.#loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click')
  protected logClick(): void {
    this.#analyticsService.logEvent(this.jetAnalytics());
  }
}
