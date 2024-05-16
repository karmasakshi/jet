import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { MockAnalyticsService } from '@jet/services/analytics/analytics.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { MockLoggerService } from '@jet/services/logger/logger.service.mock';
import { AnalyticsDirective } from './analytics.directive';

describe('AnalyticsDirective', () => {
  it('should create an instance', () => {
    const mockAnalyticsService: AnalyticsService =
      new MockAnalyticsService() as AnalyticsService;
    const mockLoggerService: LoggerService =
      new MockLoggerService() as LoggerService;
    const directive = new AnalyticsDirective(
      mockAnalyticsService,
      mockLoggerService,
    );
    expect(directive).toBeTruthy();
  });
});
