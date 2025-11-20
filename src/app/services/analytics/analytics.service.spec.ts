import { TestBed } from '@angular/core/testing';
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from '@jet/injection-tokens/google-analytics-measurement-id.injection-token';
import { IS_ANALYTICS_ENABLED } from '@jet/injection-tokens/is-analytics-enabled.injection-token';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GOOGLE_ANALYTICS_MEASUREMENT_ID, useValue: '' },
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
