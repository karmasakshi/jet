import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  InputSignal,
  untracked,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'jet-page',
  styleUrl: './page.component.scss',
  templateUrl: './page.component.html',
})
export class PageComponent {
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);
  readonly #loggerService = inject(LoggerService);
  readonly #toolbarTitleService = inject(ToolbarTitleService);

  readonly #defaultSeoImageUrl: string;

  public readonly seoDescription: InputSignal<string> = input.required();
  public readonly seoImageUrl: InputSignal<string | undefined> = input();
  public readonly seoKeywords: InputSignal<string> = input.required();
  public readonly seoTitle: InputSignal<string> = input.required();
  public readonly toolbarTitle: InputSignal<string> = input.required();

  public constructor() {
    this.#defaultSeoImageUrl = `${window.location.origin}/og-image.jpg`;

    effect(
      () => {
        this.#loggerService.logEffectRun('seoDescription');

        const seoDescription = this.seoDescription();

        untracked(() => {
          this.#meta.updateTag({
            content: seoDescription,
            name: 'description',
          });
          this.#meta.updateTag({
            content: seoDescription,
            name: 'og:description',
          });
        });
      },
      { debugName: 'seoDescription' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('seoImageUrl');

        const seoImageUrl = this.seoImageUrl() ?? this.#defaultSeoImageUrl;

        untracked(() => {
          this.#meta.updateTag({ content: seoImageUrl, name: 'og:image' });
        });
      },
      { debugName: 'seoImageUrl' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('seoKeywords');

        const seoKeywords = this.seoKeywords();

        untracked(() => {
          this.#meta.updateTag({ content: seoKeywords, name: 'keywords' });
        });
      },
      { debugName: 'seoKeywords' },
    );

    effect(
      () => {
        this.#loggerService.logEffectRun('seoTitle');

        const seoTitle = this.seoTitle();

        untracked(() => {
          this.#title.setTitle(seoTitle);
          this.#meta.updateTag({ content: seoTitle, name: 'og:title' });
        });
      },
      { debugName: 'seoTitle' },
    );

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
