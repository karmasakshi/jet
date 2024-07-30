/* eslint-disable @typescript-eslint/no-unused-vars */

import { Observable, of } from 'rxjs';

export class ToolbarTitleServiceMock {
  public readonly toolbarTitle$: Observable<string> = of('Mock Toolbar Title');

  public setToolbarTitle(_toolbarTitle: string) {
    // Mock implementation, do nothing
  }
}
