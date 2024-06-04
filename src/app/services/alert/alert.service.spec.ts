import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SettingsService } from '../settings/settings.service';
import { SettingsServiceMock } from '../settings/settings.service.mock';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
      ],
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
