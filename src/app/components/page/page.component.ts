import { Component, Input, OnInit } from '@angular/core';
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
export class PageComponent implements OnInit {
  @Input({ required: true }) public seoDescription!: string;
  @Input() public seoImageUrl: string | undefined;
  @Input({ required: true }) public seoKeywords!: string;
  @Input({ required: true }) public seoTitle!: string;
  @Input({ required: true }) public toolbarTitle!: string;

  private readonly _commonKeywords: string;
  private readonly _defaultSeoImageUrl: string;

  public constructor(
    private readonly _meta: Meta,
    private readonly _title: Title,
    private readonly _loggerService: LoggerService,
    private readonly _toolbarTitleService: ToolbarTitleService,
  ) {
    this._commonKeywords = 'jet';

    this._defaultSeoImageUrl = 'https://jet.jet/og-image.jpg';

    this._loggerService.logComponentInitialization('PageComponent');
  }

  public ngOnInit(): void {
    this._toolbarTitleService.setToolbarTitle(this.toolbarTitle);

    this._title.setTitle(this.seoTitle);

    this._meta.updateTag({
      content: `${this.seoKeywords}, ${this._commonKeywords}`,
      name: 'keywords',
    });

    this._meta.updateTag({ content: this.seoDescription, name: 'description' });
    this._meta.updateTag({
      content: this.seoDescription,
      name: 'og:description',
    });
    this._meta.updateTag({
      content: this.seoDescription,
      name: 'twitter:description',
    });

    this._meta.updateTag({
      content: this.seoImageUrl ?? this._defaultSeoImageUrl,
      name: 'og:image',
    });
    this._meta.updateTag({
      content: this.seoImageUrl ?? this._defaultSeoImageUrl,
      name: 'twitter:image',
    });

    this._meta.updateTag({ content: this.seoTitle, name: 'og:title' });
    this._meta.updateTag({ content: this.seoTitle, name: 'twitter:title' });
  }
}
