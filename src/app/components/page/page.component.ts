import { Component, effect, inject, input, untracked } from '@angular/core';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';

@Component({ selector: 'jet-page', templateUrl: './page.component.html' })
export class PageComponent {
  readonly #loggerService = inject(LoggerService);
  readonly #toolbarTitleService = inject(ToolbarTitleService);

  public readonly toolbarTitle = input.required<string>();

  public constructor() {
    effect(
      () => {
        this.#loggerService.logEffectRun('toolbarTitle');

        const toolbarTitle = this.toolbarTitle();

        untracked(() => {
          this.#toolbarTitleService.setToolbarTitle(toolbarTitle);
        });
      },
      { debugName: 'toolbarTitle' },
    );

    this.#loggerService.logComponentInitialization('PageComponent');
  }
}
