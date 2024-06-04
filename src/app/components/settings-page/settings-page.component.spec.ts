import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { SettingsServiceMock } from '@jet/services/settings/settings.service.mock';
import { StorageService } from '@jet/services/storage/storage.service';
import { StorageServiceMock } from '@jet/services/storage/storage.service.mock';
import { TitleService } from '@jet/services/title/title.service';
import { TitleServiceMock } from '@jet/services/title/title.service.mock';
import { UpdateService } from '@jet/services/update/update.service';
import { UpdateServiceMock } from '@jet/services/update/update.service.mock';
import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), SettingsPageComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: TitleService, useClass: TitleServiceMock },
        { provide: UpdateService, useClass: UpdateServiceMock },
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
