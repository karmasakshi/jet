import { TestBed } from '@angular/core/testing';
import { IS_LOGGING_ENABLED } from '@jet/tokens/is-logging-enabled.token';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IS_LOGGING_ENABLED, useValue: false }],
    });
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
