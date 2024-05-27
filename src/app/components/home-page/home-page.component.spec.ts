import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getTranslocoModule } from '@jet/modules/transloco-testing.module';
import { LoggerService } from '@jet/services/logger/logger.service';
import { MockLoggerService } from '@jet/services/logger/logger.service.mock';
import { TitleService } from '@jet/services/title/title.service';
import { MockTitleService } from '@jet/services/title/title.service.mock';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule(), HomePageComponent],
      providers: [
        { provide: LoggerService, useClass: MockLoggerService },
        { provide: TitleService, useClass: MockTitleService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
