import { TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { AlertService } from '../alert/alert.service';
import { AlertServiceMock } from '../alert/alert.service.mock';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { UpdateService } from './update.service';

describe('UpdateService', () => {
  let service: UpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: false,
        }),
        TranslocoTestingModule.forRoot({}),
      ],
      providers: [
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    });
    service = TestBed.inject(UpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
