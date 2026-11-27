/* eslint-disable @typescript-eslint/naming-convention */

import { PageMetadata } from '@jet/interfaces/page-metadata.interface';

export const PAGE_METADATAS: Record<string, Partial<PageMetadata>> = {
  '/': {
    description:
      'Angular framework for your AI agents to consistently build accessible, performant, scalable and secure web apps.',
    title: 'Jet: Angular framework for building high quality web apps',
  },
  '/**': { noIndex: true, title: 'Message' },
  '/email-verification-pending': { noIndex: true, title: 'Message' },
  '/profile': { noIndex: true, title: 'Profile' },
  '/reset-password': { noIndex: true, title: 'Reset Password' },
  '/reset-password-email-sent': { noIndex: true, title: 'Message' },
  '/settings': { title: 'Settings' },
  '/sign-in': { noIndex: true, title: 'Sign In' },
  '/sign-in-link-sent': { noIndex: true, title: 'Message' },
  '/sign-out': { noIndex: true, title: 'Sign Out' },
  '/sign-up': { noIndex: true, title: 'Sign Up' },
  '/update-password': { noIndex: true, title: 'Update Password' },
};
