import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { AuthenticationServiceMock } from '@jet/services/authentication/authentication.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from '@jet/services/progress-bar/progress-bar.service.mock';
import { StorageService } from '@jet/services/storage/storage.service';
import { StorageServiceMock } from '@jet/services/storage/storage.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { LogoutPageComponent } from './logout-page.component';

describe('LogoutPageComponent', () => {
  let component: LogoutPageComponent;
  let fixture: ComponentFixture<LogoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({}), LogoutPageComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ProgressBarService, useClass: ProgressBarServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
