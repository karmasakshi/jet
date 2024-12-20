import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { AnalyticsDirective } from './analytics.directive';

@Component({
  template: `
    <button
      jetAnalytics
      jetAnalyticsEventData="eventData"
      jetAnalyticsEventName="eventName"
      type="button"
    >
      Click Me
    </button>
  `,
})
class TestHostComponent {}

describe('AnalyticsDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsDirective],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
