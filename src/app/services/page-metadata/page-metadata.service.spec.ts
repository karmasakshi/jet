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
  it('removes the robots tag when navigating to an indexable page', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            component: TestPageComponent,
            data: { pageMetadata: { noIndex: true } },
            path: 'hidden',
          },
          { component: TestPageComponent, path: 'profile' },
        ]),
        { provide: TitleStrategy, useExisting: PageMetadataService },
      ],
    });

    const harness = await RouterTestingHarness.create('/hidden');
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex',
    );

    await harness.navigateByUrl('/profile');
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it('applies Open Graph overrides and derives the canonical from the route', async () => {
    const image = 'https://cdn.example.com/profile.jpg';
    const pageMetadata: Partial<PageMetadata> = { og: { image, type: 'profile' } };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ component: TestPageComponent, data: { pageMetadata }, path: 'profile' }]),
        { provide: TitleStrategy, useExisting: PageMetadataService },
      ],
    });

    await RouterTestingHarness.create('/profile?ref=email#bio');
    expect(document.title).toBe(DEFAULT_PAGE_METADATA.title);
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'profile',
    );
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      image,
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      new URL('/profile', import.meta.env.NG_APP_APP_URL).href,
    );
  });
});
