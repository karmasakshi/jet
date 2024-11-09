import {
  Component,
  InputSignal,
  OnChanges,
  inject,
  input,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ToolbarTitleService } from '@jet/services/toolbar-title/toolbar-title.service';

@Component({
  imports: [],
  selector: 'jet-page',
  standalone: true,
  styleUrl: './page.component.scss',
  templateUrl: './page.component.html',
})
export class PageComponent implements OnChanges {
  private readonly _meta = inject(Meta);
  private readonly _title = inject(Title);
  private readonly _loggerService = inject(LoggerService);
  private readonly _toolbarTitleService = inject(ToolbarTitleService);

  private readonly _defaultSeoImageUrl: string;

  public readonly seoDescription: InputSignal<string> = input.required();
  public readonly seoImageUrl: InputSignal<string | undefined> = input();
  public readonly seoKeywords: InputSignal<string> = input.required();
  public readonly seoTitle: InputSignal<string> = input.required();
  public readonly toolbarTitle: InputSignal<string> = input.required();

  public constructor() {
    this._defaultSeoImageUrl = 'https://jet-tau.vercel.app/og-image.jpg';

    this._loggerService.logComponentInitialization('PageComponent');
  }

  public ngOnChanges(): void {
    // Toolbar Title
    this._toolbarTitleService.setToolbarTitle(this.toolbarTitle());

    // Title
    this._title.setTitle(this.seoTitle());
    this._meta.updateTag({ content: this.seoTitle(), name: 'og:title' });

    // Keywords
    this._meta.updateTag({
      content: this.seoKeywords(),
      name: 'keywords',
    });

    // Description
    this._meta.updateTag({
      content: this.seoDescription(),
      name: 'description',
    });
    this._meta.updateTag({
      content: this.seoDescription(),
      name: 'og:description',
    });

    // SEO Image URL
    this._meta.updateTag({
      content: this.seoImageUrl() ?? this._defaultSeoImageUrl,
      name: 'og:image',
    });
  }
}
