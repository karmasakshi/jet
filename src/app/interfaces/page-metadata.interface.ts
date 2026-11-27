export interface PageMetadata {
  description: string;
  noIndex: boolean;
  og: { image: string; type: string };
  title: string;
  twitter: { card: 'app' | 'player' | 'summary_large_image' | 'summary' };
}
