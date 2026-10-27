import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { NavItemService } from './nav-item.service';

describe('NavItemService', () => {
  let service: NavItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    });
    service = TestBed.inject(NavItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
