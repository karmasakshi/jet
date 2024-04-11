import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@xxx/modules/transloco-testing.module';
import { LoggerService } from '@xxx/services/logger/logger.service';
import { MockLoggerService } from '@xxx/services/logger/logger.service.mock';
import { TitleService } from '@xxx/services/title/title.service';
import { MockTitleService } from '@xxx/services/title/title.service.mock';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), HomePageComponent],
      providers: [
        { provide: LoggerService, useClass: MockLoggerService },
        { provide: TitleService, useClass: MockTitleService },
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
