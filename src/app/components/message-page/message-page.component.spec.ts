import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { MessagePageComponent } from './message-page.component';

describe('MessagePageComponent', () => {
  let component: MessagePageComponent;
  let fixture: ComponentFixture<MessagePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePageComponent, TranslocoTestingModule.forRoot({ langs: { en: {} } })],
      providers: [provideRouter([]), { provide: LoggerService, useClass: LoggerServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
