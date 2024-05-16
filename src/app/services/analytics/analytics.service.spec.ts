import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
import { LoggerService } from '../logger/logger.service';
import { MockLoggerService } from '../logger/logger.service.mock';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [{ provide: LoggerService, useClass: MockLoggerService }],
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
