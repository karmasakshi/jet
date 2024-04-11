import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { getTranslocoModule } from '@xxx/modules/transloco-testing.module';
import { AlertService } from '@xxx/services/alert/alert.service';
import { MockAlertService } from '@xxx/services/alert/alert.service.mock';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { MockLoggerService } from '@xxx/services/logger/logger.service.mock';
import { SettingsService } from '@xxx/services/settings/settings.service';
import { MockSettingsService } from '@xxx/services/settings/settings.service.mock';
import { StorageService } from '@xxx/services/storage/storage.service';
import { MockStorageService } from '@xxx/services/storage/storage.service.mock';
import { TitleService } from '@xxx/services/title/title.service';
import { MockTitleService } from '@xxx/services/title/title.service.mock';
import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
