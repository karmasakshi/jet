import { Graph, Thing, WithContext } from 'schema-dts';

export interface PageMetadata {
  description: string;
  jsonLd: Graph | WithContext<Thing>;
  noIndex: boolean;
  og: Partial<{ image: string; type: string }>;
  title: string;
  twitter: { card: 'app' | 'player' | 'summary_large_image' | 'summary' };
}
