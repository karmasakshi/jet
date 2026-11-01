import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { AnalyticsEventDirective } from './analytics-event.directive';

describe('AnalyticsEventDirective', () => {
  let directive: AnalyticsEventDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        AnalyticsEventDirective,
      ],
    });

    directive = TestBed.inject(AnalyticsEventDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
