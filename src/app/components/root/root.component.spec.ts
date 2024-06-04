import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
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
import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        getTranslocoModule(),
        RootComponent,
      ],
      providers: [
        { provide: LoaderService, useClass: LoaderServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: SettingsService, useClass: SettingsServiceMock },
        { provide: TitleService, useClass: TitleServiceMock },
        { provide: UpdateService, useClass: UpdateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
