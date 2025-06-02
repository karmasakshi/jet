import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ProfileService } from '@jet/services/profile/profile.service';
import { ProfileServiceMock } from '@jet/services/profile/profile.service.mock';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from '@jet/services/progress-bar/progress-bar.service.mock';
import { UserService } from '@jet/services/user/user.service';
import { UserServiceMock } from '@jet/services/user/user.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ProfilePage } from './profile-page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({}), ProfilePage],
      providers: [
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ProfileService, useClass: ProfileServiceMock },
        { provide: ProgressBarService, useClass: ProgressBarServiceMock },
        { provide: UserService, useClass: UserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
