import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { ToolbarTitleServiceMock } from '@jet/services/toolbar-title/toolbar-title.service.mock';
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  let component: PageComponent;
  let componentRef: ComponentRef<PageComponent>;
  let fixture: ComponentFixture<PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ToolbarTitleService, useClass: ToolbarTitleServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('seoDescription', undefined);
    componentRef.setInput('seoKeywords', undefined);
    componentRef.setInput('seoTitle', undefined);
    componentRef.setInput('toolbarTitle', undefined);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
