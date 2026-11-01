import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TranslocoHttpLoader } from './transloco-http-loader';

describe('TranslocoHttpLoader', () => {
  let instance: TranslocoHttpLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        TranslocoHttpLoader,
      ],
    });

    instance = TestBed.inject(TranslocoHttpLoader);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });
});
