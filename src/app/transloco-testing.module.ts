import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@ngneat/transloco';
import ar from '../assets/i18n/ar.json';
import en from '../assets/i18n/en.json';
import { DEFAULT_LANGUAGE } from './constants/default-language.constant';
import { LANGUAGES } from './constants/languages.constant';
import { Language } from './interfaces/language.interface';

export function getTranslocoModule(
  translocoTestingOptions: TranslocoTestingOptions = {},
) {
  return TranslocoTestingModule.forRoot({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    langs: {
      ar,
      en,
    },
    preloadLangs: true,
    translocoConfig: {
      availableLangs: LANGUAGES.map(
        (language: Language): string => language.value,
      ),
      defaultLang: DEFAULT_LANGUAGE.value,
    },
    ...translocoTestingOptions,
  });
}
