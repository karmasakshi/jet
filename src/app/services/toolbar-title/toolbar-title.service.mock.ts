/* eslint-disable @typescript-eslint/no-unused-vars */

import { Signal, signal, WritableSignal } from '@angular/core';

export class ToolbarTitleServiceMock {
  readonly #toolbarTitle: WritableSignal<string | undefined>;

  public constructor() {
    this.#toolbarTitle = signal(undefined);
  }

  public get toolbarTitle(): Signal<string | undefined> {
    return this.#toolbarTitle.asReadonly();
  }

  public setToolbarTitle(_toolbarTitle: string): void {
    // Do nothing
  }
}
