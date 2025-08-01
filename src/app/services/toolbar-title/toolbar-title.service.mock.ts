/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';

export class ToolbarTitleServiceMock {
  readonly #toolbarTitle: WritableSignal<null | string>;

  public constructor() {
    this.#toolbarTitle = signal(null);
  }

  public get toolbarTitle(): Signal<null | string> {
    return this.#toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Do nothing
  }
}
