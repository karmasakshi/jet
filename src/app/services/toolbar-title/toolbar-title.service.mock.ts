/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';

export class ToolbarTitleServiceMock {
  private readonly _toolbarTitle: WritableSignal<null | string>;

  public constructor() {
    this._toolbarTitle = signal(null);
  }

  public get toolbarTitle(): Signal<null | string> {
    return this._toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Do nothing
  }
}
