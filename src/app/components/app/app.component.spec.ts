import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterModule } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from '@jet/services/progress-bar/progress-bar.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { SettingsServiceMock } from '@jet/services/settings/settings.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconTestingModule,
        RouterModule.forRoot([]),
        TranslocoTestingModule.forRoot({ langs: { en: {} } }),
        AppComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ProgressBarService, useClass: ProgressBarServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
