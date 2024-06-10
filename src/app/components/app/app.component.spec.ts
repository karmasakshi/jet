import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { LoaderService } from '@jet/services/loader/loader.service';
import { LoaderServiceMock } from '@jet/services/loader/loader.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { SettingsServiceMock } from '@jet/services/settings/settings.service.mock';
import { TitleService } from '@jet/services/title/title.service';
import { TitleServiceMock } from '@jet/services/title/title.service.mock';
import { UpdateService } from '@jet/services/update/update.service';
import { UpdateServiceMock } from '@jet/services/update/update.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        TranslocoTestingModule.forRoot({}),
        AppComponent,
      ],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: LoaderService, useClass: LoaderServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
        { provide: TitleService, useClass: TitleServiceMock },
        { provide: UpdateService, useClass: UpdateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
