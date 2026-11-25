import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter } from '@angular/router';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { BadgeContentService } from '@jet/services/badge-content/badge-content.service';
import { BadgeContentServiceMock } from '@jet/services/badge-content/badge-content.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { NavItemService } from '@jet/services/nav-item/nav-item.service';
import { NavItemServiceMock } from '@jet/services/nav-item/nav-item.service.mock';
import { SettingsService } from '@jet/services/settings/settings.service';
import { SettingsServiceMock } from '@jet/services/settings/settings.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MatIconTestingModule,
        TranslocoTestingModule.forRoot({ langs: { en: {} } }),
      ],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { isMatched: () => undefined, observe: () => EMPTY },
        },
        provideRouter([]),
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: BadgeContentService, useClass: BadgeContentServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: NavItemService, useClass: NavItemServiceMock },
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
