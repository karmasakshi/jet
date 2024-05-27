import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
import { AlertService } from '@jet/services/alert/alert.service';
import { MockAlertService } from '@jet/services/alert/alert.service.mock';
import { LoaderService } from '@jet/services/loader/loader.service';
import { MockLoaderService } from '@jet/services/loader/loader.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { MockLoggerService } from '@jet/services/logger/logger.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { MockSettingsService } from '@jet/services/settings/settings.service.mock';
import { StorageService } from '@jet/services/storage/storage.service';
import { MockStorageService } from '@jet/services/storage/storage.service.mock';
import { TitleService } from '@jet/services/title/title.service';
import { MockTitleService } from '@jet/services/title/title.service.mock';
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: false,
        }),
        getTranslocoModule(),
        RootComponent,
      ],
      providers: [
        { provide: AlertService, useClass: MockAlertService },
        { provide: LoaderService, useClass: MockLoaderService },
        { provide: LoggerService, useClass: MockLoggerService },
        { provide: SettingsService, useClass: MockSettingsService },
        { provide: StorageService, useClass: MockStorageService },
        { provide: TitleService, useClass: MockTitleService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
