import { Directive, HostListener, inject, input } from '@angular/core';
import { AnalyticsEvent } from '@jet/interfaces/analytics-event.interface';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { LoggerService } from '@jet/services/logger/logger.service';

@Directive({ selector: '[jetAnalyticsEvent]' })
export class AnalyticsDirective {
  readonly #analyticsService = inject(AnalyticsService);
  readonly #loggerService = inject(LoggerService);

  public readonly jetAnalyticsEvent = input.required<AnalyticsEvent>();

  public constructor() {
    this.#loggerService.logDirectiveInitialization('AnalyticsDirective');
  }

  @HostListener('click')
  protected logAnalyticsEvent(): void {
    this.#analyticsService.logAnalyticsEvent(this.jetAnalyticsEvent());
  }
}
