import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'public/i18n/',
  langs: ['ar', 'en'],
  keysManager: { defaultValue: '', output: './public/i18n/', sort: true, unflat: true },
};

export default config;
