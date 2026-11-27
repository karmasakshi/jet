import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DEFAULT_PAGE_METADATA } from '@jet/constants/default-page-metadata.constant';
import { PageMetadata } from '@jet/interfaces/page-metadata.interface';
import { PageMetadataService } from './page-metadata.service';

@Component({ selector: 'jet-test-page', template: '' })
class TestPageComponent {}

describe('PageMetadataService', () => {
  it('applies an image-only override and derives the canonical from the route', async () => {
    const pageMetadata: Partial<PageMetadata> = { og: { image: '/profile.jpg' } };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ component: TestPageComponent, data: { pageMetadata }, path: 'profile' }]),
        { provide: TitleStrategy, useExisting: PageMetadataService },
      ],
    });

    await RouterTestingHarness.create('/profile?ref=email#bio');
    expect(document.title).toBe(DEFAULT_PAGE_METADATA.title);
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      DEFAULT_PAGE_METADATA.og.type,
    );
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      new URL('/profile.jpg', import.meta.env.NG_APP_APP_URL).href,
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      new URL('/profile', import.meta.env.NG_APP_APP_URL).href,
    );
  });
});
