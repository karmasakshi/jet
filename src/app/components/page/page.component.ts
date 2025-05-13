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
  private readonly _meta = inject(Meta);
  private readonly _title = inject(Title);
  private readonly _loggerService = inject(LoggerService);
  private readonly _toolbarTitleService = inject(ToolbarTitleService);

  private readonly _defaultSeoImageUrl: string;

  public readonly seoDescription: InputSignal<string> = input.required();
  public readonly seoImageUrl: InputSignal<undefined | string> = input();
  public readonly seoKeywords: InputSignal<string> = input.required();
  public readonly seoTitle: InputSignal<string> = input.required();
  public readonly toolbarTitle: InputSignal<string> = input.required();

  public constructor() {
    this._defaultSeoImageUrl = `${window.location.origin}/og-image.jpg`;

    effect(() => {
      this._loggerService.logEffectRun('seoDescription');

      const seoDescription = this.seoDescription();

      untracked(() => {
        this._meta.updateTag({ content: seoDescription, name: 'description' });
        this._meta.updateTag({
          content: seoDescription,
          name: 'og:description',
        });
      });
    });

    effect(() => {
      this._loggerService.logEffectRun('seoImageUrl');

      const seoImageUrl = this.seoImageUrl() ?? this._defaultSeoImageUrl;

      untracked(() => {
        this._meta.updateTag({ content: seoImageUrl, name: 'og:image' });
      });
    });

    effect(() => {
      this._loggerService.logEffectRun('seoKeywords');

      const seoKeywords = this.seoKeywords();

      untracked(() => {
        this._meta.updateTag({ content: seoKeywords, name: 'keywords' });
      });
    });

    effect(() => {
      this._loggerService.logEffectRun('seoTitle');

      const seoTitle = this.seoTitle();

      untracked(() => {
        this._title.setTitle(seoTitle);
        this._meta.updateTag({ content: seoTitle, name: 'og:title' });
      });
    });

    effect(() => {
      this._loggerService.logEffectRun('toolbarTitle');

      const toolbarTitle = this.toolbarTitle();

      untracked(() => {
        this._toolbarTitleService.setToolbarTitle(toolbarTitle);
      });
    });

    this._loggerService.logComponentInitialization('PageComponent');
  }
}
