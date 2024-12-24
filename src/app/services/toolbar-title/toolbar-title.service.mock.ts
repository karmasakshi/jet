/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, WritableSignal, signal } from '@angular/core';

export class ToolbarTitleServiceMock {
  private readonly _toolbarTitle: WritableSignal<string | undefined>;

  public constructor() {
    this._toolbarTitle = signal(undefined);
  }

  public get toolbarTitle(): Signal<string | undefined> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Do nothing
  }
}
