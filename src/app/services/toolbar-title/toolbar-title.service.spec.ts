import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { ToolbarTitleService } from './toolbar-title.service';

describe('ToolbarTitleService', () => {
  let service: ToolbarTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    });
    service = TestBed.inject(ToolbarTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
