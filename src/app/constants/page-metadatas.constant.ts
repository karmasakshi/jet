/* eslint-disable @typescript-eslint/naming-convention */

import { PageMetadata } from '@jet/interfaces/page-metadata.interface';

export const PAGE_METADATAS: Record<string, Partial<PageMetadata>> = {
  '/': {
    description:
      'Angular framework for your AI agents to consistently build accessible, performant, scalable and secure web apps.',
    title: 'Jet: Angular framework for building high quality web apps',
  },
  '/**': { noIndex: true, title: 'Message' },
  '/email-verification-pending': { title: 'Message' },
  '/profile': { title: 'Profile' },
  '/reset-password': { title: 'Reset Password' },
  '/reset-password-email-sent': { title: 'Message' },
  '/settings': { title: 'Settings' },
  '/sign-in': { title: 'Sign In' },
  '/sign-in-link-sent': { title: 'Message' },
  '/sign-out': { title: 'Sign Out' },
  '/sign-up': { title: 'Sign Up' },
  '/update-password': { title: 'Update Password' },
};
