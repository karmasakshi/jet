import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from '@jet/services/progress-bar/progress-bar.service.mock';
import { UserService } from '@jet/services/user/user.service';
import { UserServiceMock } from '@jet/services/user/user.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { SignOutPageComponent } from './sign-out-page.component';

describe('SignOutPageComponent', () => {
  let component: SignOutPageComponent;
  let fixture: ComponentFixture<SignOutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({ langs: { en: {} } }),
        SignOutPageComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ProgressBarService, useClass: ProgressBarServiceMock },
        { provide: UserService, useClass: UserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignOutPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
