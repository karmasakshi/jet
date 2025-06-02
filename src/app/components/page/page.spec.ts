import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { ToolbarTitleServiceMock } from '@jet/services/toolbar-title/toolbar-title.service.mock';
import { Page } from './page';

describe('Page', () => {
  let component: Page;
  let componentRef: ComponentRef<Page>;
  let fixture: ComponentFixture<Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Page],
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: ToolbarTitleService, useClass: ToolbarTitleServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Page);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('seoDescription', '');
    componentRef.setInput('seoKeywords', '');
    componentRef.setInput('seoTitle', '');
    componentRef.setInput('toolbarTitle', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
