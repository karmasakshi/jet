import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { EmptyCardComponent } from './empty-card.component';

describe('EmptyCardComponent', () => {
  let component: EmptyCardComponent;
  let fixture: ComponentFixture<EmptyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCardComponent],
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('height', undefined);
    fixture.componentRef.setInput('message', undefined);
    fixture.componentRef.setInput('width', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
