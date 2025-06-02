import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ServiceWorkerService } from '@jet/services/service-worker/service-worker.service';
import { ServiceWorkerServiceMock } from '@jet/services/service-worker/service-worker.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { SettingsServiceMock } from '@jet/services/settings/settings.service.mock';
import { StorageService } from '@jet/services/storage/storage.service';
import { StorageServiceMock } from '@jet/services/storage/storage.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { SettingsPage } from './settings-page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({}), SettingsPage],
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ServiceWorkerService, useClass: ServiceWorkerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
