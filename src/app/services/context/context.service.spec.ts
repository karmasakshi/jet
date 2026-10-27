import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SettingsService } from '../settings/settings.service';
import { SettingsServiceMock } from '../settings/settings.service.mock';
import { ContextService } from './context.service';

describe('ContextService', () => {
  let service: ContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
      ],
    });
    service = TestBed.inject(ContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
