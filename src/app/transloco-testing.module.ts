import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import ar from '../assets/i18n/ar.json';
import en from '../assets/i18n/en.json';
import { DEFAULT_LANGUAGE } from './constants/default-language.constant';
import { LANGUAGES } from './constants/languages.constant';
import { Language } from './interfaces/language.interface';

export function getTranslocoModule(
  translocoTestingOptions: TranslocoTestingOptions = {},
) {
  return TranslocoTestingModule.forRoot({
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
