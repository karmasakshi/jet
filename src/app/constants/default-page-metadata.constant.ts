import { PageMetadata } from '@jet/interfaces/page-metadata.interface';

export const DEFAULT_PAGE_METADATA: PageMetadata = {
  description: 'Jet.',
  noIndex: false,
  og: { image: new URL('/og-image.jpg', import.meta.env.NG_APP_APP_URL).href, type: 'website' },
  title: 'Jet',
  twitter: { card: 'summary_large_image' },
};
