import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@jet/services/analytics/analytics.service';
import { AnalyticsServiceMock } from '@jet/services/analytics/analytics.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { Analytics } from './analytics';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Analytics],
  template: `
    <button
      [jetAnalytics]="{ data: { key: 'value' }, name: 'name' }"
      type="button"
    >
      Click
    </button>
  `,
})
class Host {}

describe('Analytics', () => {
  let component: Host;
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Host);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
