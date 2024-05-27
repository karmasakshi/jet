import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
import { AlertService } from '@jet/services/alert/alert.service';
import { MockAlertService } from '@jet/services/alert/alert.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { MockLoggerService } from '@jet/services/logger/logger.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { MockSettingsService } from '@jet/services/settings/settings.service.mock';
import { StorageService } from '@jet/services/storage/storage.service';
import { MockStorageService } from '@jet/services/storage/storage.service.mock';
import { TitleService } from '@jet/services/title/title.service';
import { MockTitleService } from '@jet/services/title/title.service.mock';
import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: false,
        }),
        getTranslocoModule(),
        SettingsPageComponent,
      ],
      providers: [
        { provide: AlertService, useClass: MockAlertService },
        { provide: LoggerService, useClass: MockLoggerService },
        { provide: SettingsService, useClass: MockSettingsService },
        { provide: StorageService, useClass: MockStorageService },
        { provide: TitleService, useClass: MockTitleService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
