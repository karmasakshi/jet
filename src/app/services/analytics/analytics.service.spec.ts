import { TestBed } from '@angular/core/testing';
import { IS_ANALYTICS_ENABLED } from '@jet/tokens/is-analytics-enabled.token';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IS_ANALYTICS_ENABLED, useValue: false },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
