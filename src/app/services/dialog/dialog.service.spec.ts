import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SettingsService } from '../settings/settings.service';
import { SettingsServiceMock } from '../settings/settings.service.mock';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: undefined },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
      ],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
