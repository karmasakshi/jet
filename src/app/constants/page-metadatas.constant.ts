/* eslint-disable @typescript-eslint/naming-convention */

import { PageMetadata } from '@jet/interfaces/page-metadata.interface';

export const PAGE_METADATAS: Record<string, PageMetadata> = {
  '/': {
    description:
      'Angular framework for your AI agents to consistently build accessible, performant, scalable and secure web apps.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Jet',
      url: import.meta.env.NG_APP_APP_URL,
    },
    title: 'Jet: Angular framework for building high quality web apps',
  },
  '/**': { canonical: '/', description: 'Jet.', noIndex: true, title: 'Message' },
  '/email-verification-pending': { description: 'Jet.', title: 'Message' },
  '/profile': { description: 'Jet.', title: 'Profile' },
  '/reset-password': { description: 'Jet.', title: 'Reset Password' },
  '/reset-password-email-sent': { description: 'Jet.', title: 'Message' },
  '/settings': { description: 'Jet.', title: 'Settings' },
  '/sign-in': { description: 'Jet.', title: 'Sign In' },
  '/sign-in-link-sent': { description: 'Jet.', title: 'Message' },
  '/sign-out': { description: 'Jet.', title: 'Sign Out' },
  '/sign-up': { description: 'Jet.', title: 'Sign Up' },
  '/update-password': { description: 'Jet.', title: 'Update Password' },
};
