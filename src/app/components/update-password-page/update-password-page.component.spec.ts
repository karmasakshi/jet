import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '@jet/services/alert/alert.service';
import { AlertServiceMock } from '@jet/services/alert/alert.service.mock';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';
import { AuthenticationServiceMock } from '@jet/services/authentication/authentication.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { UpdatePasswordPageComponent } from './update-password-page.component';

describe('UpdatePasswordPageComponent', () => {
  let component: UpdatePasswordPageComponent;
  let fixture: ComponentFixture<UpdatePasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({}),
        UpdatePasswordPageComponent,
      ],
      providers: [
        { provide: AlertService, useClass: AlertServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
