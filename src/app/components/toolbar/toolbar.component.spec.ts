import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { ProgressBarServiceMock } from '@jet/services/progress-bar/progress-bar.service.mock';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { ToolbarTitleServiceMock } from '@jet/services/toolbar-title/toolbar-title.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconTestingModule,
        TranslocoTestingModule.forRoot({ langs: { en: {} } }),
        ToolbarComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ProgressBarService, useClass: ProgressBarServiceMock },
        { provide: ToolbarTitleService, useClass: ToolbarTitleServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isLargeViewport', undefined);
    fixture.componentRef.setInput('shouldAddSafeArea', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
