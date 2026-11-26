import { TestBed } from '@angular/core/testing';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';
import { PageComponent } from './page.component';

describe('PageComponent', () => {
  it('updates the toolbar title when its input changes', () => {
    const fixture = TestBed.createComponent(PageComponent);
    const service = TestBed.inject(ToolbarTitleService);
    fixture.componentRef.setInput('toolbarTitle', 'Messages');
    fixture.detectChanges();
    expect(service.toolbarTitle()).toBe('Messages');

    fixture.componentRef.setInput('toolbarTitle', 'رسائل');
    fixture.detectChanges();
    expect(service.toolbarTitle()).toBe('رسائل');
  });
});
