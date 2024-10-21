/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';

export class ToolbarTitleServiceMock {
  private readonly _toolbarTitle: WritableSignal<string>;

  public constructor() {
    this._toolbarTitle = signal('');
  }

  public get toolbarTitle(): Signal<string> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Mock implementation, do nothing
  }
}
