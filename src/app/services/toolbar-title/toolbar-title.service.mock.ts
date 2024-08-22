/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';

export class ToolbarTitleServiceMock {
  public get toolbarTitle(): Signal<string> {
    const toolbarTitle: WritableSignal<string> = signal('');

    return toolbarTitle.asReadonly();
  }

  public updateToolbarTitle(_toolbarTitle: string): void {
    // Mock implementation, do nothing
  }
}
