import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { BadgeContentService } from './badge-content.service';

describe('BadgeContentService', () => {
  let service: BadgeContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    });
    service = TestBed.inject(BadgeContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
