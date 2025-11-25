import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { EmptyCardComponent } from './empty-card.component';

describe('EmptyCardComponent', () => {
  let component: EmptyCardComponent;
  let fixture: ComponentFixture<EmptyCardComponent>;
  let componentRef: ComponentRef<EmptyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCardComponent],
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('height', undefined);
    componentRef.setInput('message', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
