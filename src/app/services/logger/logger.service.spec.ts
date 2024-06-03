import { TestBed } from '@angular/core/testing';
import { IS_LOGGING_ENABLED_TOKEN } from '@jet/tokens/is-logging-enabled.token';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IS_LOGGING_ENABLED_TOKEN, useValue: false }],
    });
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
