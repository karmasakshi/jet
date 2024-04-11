import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { MockLoggerService } from '../logger/logger.service.mock';
import { TitleService } from './title.service';

describe('TitleService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoggerService, useClass: MockLoggerService }],
    });
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
