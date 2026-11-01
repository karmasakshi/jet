import { TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { JetMatPaginatorIntl } from './jet-mat-paginator-intl';

describe('JetMatPaginatorIntl', () => {
  let instance: JetMatPaginatorIntl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({ langs: { en: {} } })],
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }, JetMatPaginatorIntl],
    });

    instance = TestBed.inject(JetMatPaginatorIntl);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });
});
