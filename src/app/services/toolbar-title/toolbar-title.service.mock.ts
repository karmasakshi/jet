/* eslint-disable @typescript-eslint/no-unused-vars */

import { signal, Signal, WritableSignal } from '@angular/core';

export class ToolbarTitleServiceMock {
  readonly #toolbarTitle: WritableSignal<string>;

  public readonly toolbarTitle: Signal<string>;

  public constructor() {
    this.#toolbarTitle = signal('');

    this.toolbarTitle = this.#toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Do nothing
  }
}
