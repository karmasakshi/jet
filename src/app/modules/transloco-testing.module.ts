import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import ar from '@xxx/assets/i18n/ar.json';
import en from '@xxx/assets/i18n/en.json';
import { DEFAULT_LANGUAGE } from '@xxx/constants/default-language.constant';
import { LANGUAGES } from '@xxx/constants/languages.constant';
import { Language } from '@xxx/interfaces/language.interface';

export function getTranslocoModule(
  translocoTestingOptions: TranslocoTestingOptions = {},
) {
  return TranslocoTestingModule.forRoot({
    langs: { ar, en },
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
