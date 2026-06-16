import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

export default {
  keysManager: { output: './public/i18n/', sort: true, unflat: true },
  langs: ['ar', 'en'],
  rootTranslationsPath: './public/i18n/',
} satisfies TranslocoGlobalConfig;
