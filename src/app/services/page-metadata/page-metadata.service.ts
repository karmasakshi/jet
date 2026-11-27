import { DOCUMENT, inject, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
  PRIMARY_OUTLET,
  RouterStateSnapshot,
  TitleStrategy,
  UrlSerializer,
} from '@angular/router';
import { DEFAULT_PAGE_METADATA } from '@jet/constants/default-page-metadata.constant';
import { PageMetadata } from '@jet/interfaces/page-metadata.interface';
import { LoggerService } from '../logger/logger.service';

@Service()
export class PageMetadataService extends TitleStrategy {
  readonly #document = inject(DOCUMENT);
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);
  readonly #urlSerializer = inject(UrlSerializer);
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    super();

    this.#loggerService.logServiceInitialization('PageMetadataService');
  }

  public override updateTitle(routerStateSnapshot: RouterStateSnapshot): void {
    let route = routerStateSnapshot.root;
    let declaration:
      | ((route: ActivatedRouteSnapshot) => Partial<PageMetadata>)
      | Partial<PageMetadata>
      | undefined;

    while (route) {
      declaration = route.data['pageMetadata'] ?? declaration;
      const child = route.children.find((candidate) => candidate.outlet === PRIMARY_OUTLET);
      if (!child) break;
      route = child;
    }

    const pageMetadata = typeof declaration === 'function' ? declaration(route) : declaration;
    const origin = import.meta.env.NG_APP_APP_URL;
    const og = pageMetadata?.og;
    const image = og?.image ?? DEFAULT_PAGE_METADATA.og.image;
    const canonicalPath = this.#urlSerializer.serialize(
      createUrlTreeFromSnapshot(route, [], null, null),
    );
    const canonical = new URL(canonicalPath, origin).href;

    const title =
      pageMetadata?.title ?? this.buildTitle(routerStateSnapshot) ?? DEFAULT_PAGE_METADATA.title;
    const description = pageMetadata?.description ?? DEFAULT_PAGE_METADATA.description;
    this.#title.setTitle(title);
    this.#updateCanonical(canonical);
    this.#updateJsonLd(pageMetadata?.jsonLd ?? DEFAULT_PAGE_METADATA.jsonLd);

    const stale = new Set(this.#document.head.querySelectorAll('meta[data-jet-seo]'));
    const tags = [
      { content: description, name: 'description' },
      {
        content: (pageMetadata?.noIndex ?? DEFAULT_PAGE_METADATA.noIndex) ? 'noindex' : undefined,
        name: 'robots',
      },
      { content: title, property: 'og:title' },
      { content: description, property: 'og:description' },
      {
        content: typeof image === 'string' ? new URL(image, origin).href : undefined,
        property: 'og:image',
      },
      { content: canonical, property: 'og:url' },
      { content: og?.type ?? DEFAULT_PAGE_METADATA.og.type, property: 'og:type' },
      { content: DEFAULT_PAGE_METADATA.title, property: 'og:site_name' },
      {
        content: pageMetadata?.twitter?.card ?? DEFAULT_PAGE_METADATA.twitter.card,
        name: 'twitter:card',
      },
    ];

    for (const tag of tags) {
      if (tag.content === undefined) continue;
      const element = this.#meta.updateTag({ ...tag, content: tag.content });
      if (element) {
        element.setAttribute('data-jet-seo', '');
        stale.delete(element);
      }
    }

    for (const element of stale) element.remove();
  }

  #updateCanonical(url: string): void {
    const existing = this.#document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const link = existing ?? this.#document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    if (!existing) this.#document.head.appendChild(link);
  }

  #updateJsonLd(jsonLd: PageMetadata['jsonLd']): void {
    const existing = this.#document.head.querySelector<HTMLScriptElement>('script#jet-json-ld');
    const script = existing ?? this.#document.createElement('script');
    script.id = 'jet-json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd).replaceAll('<', '\\u003c');
    if (!existing) this.#document.head.appendChild(script);
  }
}
