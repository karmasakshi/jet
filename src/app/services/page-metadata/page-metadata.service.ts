import { DOCUMENT, inject, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PRIMARY_OUTLET, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { DEFAULT_PAGE_METADATA } from '@jet/constants/default-page-metadata.constant';
import { PageMetadata } from '@jet/interfaces/page-metadata.interface';
import { WebSite, WithContext } from 'schema-dts';
import { LoggerService } from '../logger/logger.service';

/* eslint-disable @typescript-eslint/naming-convention */
const WEBSITE_JSON_LD: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: DEFAULT_PAGE_METADATA.title,
  url: new URL('/', import.meta.env.NG_APP_APP_URL).href,
};
/* eslint-enable @typescript-eslint/naming-convention */

@Service()
export class PageMetadataService extends TitleStrategy {
  readonly #document = inject(DOCUMENT);
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);
  readonly #loggerService = inject(LoggerService);

  public constructor() {
    super();

    this.#loggerService.logServiceInitialization('PageMetadataService');
  }

  public override updateTitle(routerStateSnapshot: RouterStateSnapshot): void {
    let route = routerStateSnapshot.root;
    let pageMetadata: Partial<PageMetadata> | undefined;

    while (true) {
      pageMetadata = route.data['pageMetadata'] ?? pageMetadata;
      const child = route.children.find((candidate) => candidate.outlet === PRIMARY_OUTLET);
      if (!child) break;
      route = child;
    }

    const title =
      pageMetadata?.title ?? this.buildTitle(routerStateSnapshot) ?? DEFAULT_PAGE_METADATA.title;
    const image = pageMetadata?.og?.image ?? DEFAULT_PAGE_METADATA.og.image;
    const url = new URL(routerStateSnapshot.url, import.meta.env.NG_APP_APP_URL);
    url.search = '';
    url.hash = '';

    this.#updateTitle(title);
    this.#updateDescription(pageMetadata?.description ?? DEFAULT_PAGE_METADATA.description);
    this.#updateCanonical(url.href);
    this.#updateWebsiteJsonLd(url.pathname === '/');
    this.#updateNoIndex(pageMetadata?.noIndex ?? DEFAULT_PAGE_METADATA.noIndex);
    this.#updateOpenGraphImage(image);
    this.#updateOpenGraphType(pageMetadata?.og?.type ?? DEFAULT_PAGE_METADATA.og.type);
    this.#updateOpenGraphSiteName(DEFAULT_PAGE_METADATA.title);
    this.#updateTwitterCard(pageMetadata?.twitter?.card ?? DEFAULT_PAGE_METADATA.twitter.card);
  }

  #updateTitle(title: string): void {
    this.#title.setTitle(title);
    this.#meta.updateTag({ content: title, property: 'og:title' });
  }

  #updateDescription(description: string): void {
    this.#meta.updateTag({ content: description, name: 'description' });
    this.#meta.updateTag({ content: description, property: 'og:description' });
  }

  #updateCanonical(url: string): void {
    const existing = this.#document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const link = existing ?? this.#document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    if (!existing) this.#document.head.appendChild(link);
    this.#meta.updateTag({ content: url, property: 'og:url' });
  }

  #updateWebsiteJsonLd(isHomePage: boolean): void {
    const existing = this.#document.head.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"]',
    );
    if (!isHomePage) {
      existing?.remove();
      return;
    }

    const script = existing ?? this.#document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(WEBSITE_JSON_LD).replaceAll('<', '\\u003c');
    if (!existing) this.#document.head.appendChild(script);
  }

  #updateNoIndex(noIndex: boolean): void {
    if (noIndex) {
      this.#meta.updateTag({ content: 'noindex', name: 'robots' });
    } else {
      this.#meta.removeTag('name="robots"');
    }
  }

  #updateOpenGraphImage(image: string): void {
    this.#meta.updateTag({ content: image, property: 'og:image' });
  }

  #updateOpenGraphType(type: string): void {
    this.#meta.updateTag({ content: type, property: 'og:type' });
  }

  #updateOpenGraphSiteName(siteName: string): void {
    this.#meta.updateTag({ content: siteName, property: 'og:site_name' });
  }

  #updateTwitterCard(card: PageMetadata['twitter']['card']): void {
    this.#meta.updateTag({ content: card, name: 'twitter:card' });
  }
}
