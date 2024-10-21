import { isDevMode } from '@angular/core';
import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

const config: TranslocoGlobalConfig = {
  flatten: {
    aot: !isDevMode(),
  },
  keysManager: {
    output: 'public/i18n/',
    sort: true,
    unflat: true,
  },
  langs: ['ar', 'en'],
  rootTranslationsPath: 'public/i18n/',
};

export default config;
