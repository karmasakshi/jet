import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { AlertService } from '../alert/alert.service';
import { AlertServiceMock } from '../alert/alert.service.mock';
import { AnalyticsService } from '../analytics/analytics.service';
import { AnalyticsServiceMock } from '../analytics/analytics.service.mock';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { ServiceWorkerService } from './service-worker.service';

describe('ServiceWorkerService', () => {
  let service: ServiceWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register(''),
        TranslocoTestingModule.forRoot({}),
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    });
    service = TestBed.inject(ServiceWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
