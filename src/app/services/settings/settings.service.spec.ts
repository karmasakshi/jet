import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { MockLoggerService } from '../logger/logger.service.mock';
import { StorageService } from '../storage/storage.service';
import { MockStorageService } from '../storage/storage.service.mock';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useClass: MockLoggerService },
        { provide: StorageService, useClass: MockStorageService },
      ],
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
