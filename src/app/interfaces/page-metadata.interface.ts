import { Graph, Thing, WithContext } from 'schema-dts';

export interface PageMetadata {
  canonical?: string;
  description: string;
  jsonLd?: Graph | WithContext<Thing>;
  noIndex?: boolean;
  og?: {
    description?: string;
    image?: string;
    site_name?: string;
    title?: string;
    type?: string;
    url?: string;
  };
  title: string;
  twitter?: { card: 'app' | 'player' | 'summary_large_image' | 'summary' };
}
