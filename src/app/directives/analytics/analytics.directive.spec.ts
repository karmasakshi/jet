import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { AnalyticsDirective } from './analytics.directive';

describe('AnalyticsDirective', () => {
  it('should create an instance', () => {
    const analyticsService: AnalyticsService =
      new AnalyticsServiceMock() as AnalyticsService;
    const loggerService: LoggerService =
      new LoggerServiceMock() as LoggerService;
    const directive = new AnalyticsDirective(analyticsService, loggerService);
    expect(directive).toBeTruthy();
  });
});
