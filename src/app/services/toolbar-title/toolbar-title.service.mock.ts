/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';

export class ToolbarTitleServiceMock {
  private readonly _toolbarTitle: WritableSignal<string | null>;

  public constructor() {
    this._toolbarTitle = signal(null);
  }

  public get toolbarTitle(): Signal<string | null> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Do nothing
  }
}
