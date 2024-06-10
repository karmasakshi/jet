import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TitleService } from '@jet/services/title/title.service';
import { TitleServiceMock } from '@jet/services/title/title.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslocoTestingModule.forRoot({}), HomePageComponent],
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: TitleService, useClass: TitleServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
