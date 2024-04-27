import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import ar from '@xxx/assets/i18n/ar.json';
import en from '@xxx/assets/i18n/en.json';
import { DEFAULT_LANGUAGE_OPTION } from '@xxx/constants/default-language-option.constant';
import { LANGUAGE_OPTIONS } from '@xxx/constants/language-options.constant';
import { LanguageOption } from '@xxx/interfaces/language-option.interface';
import { AvailableLanguage } from '@xxx/types/available-language.type';

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
      availableLangs: LANGUAGE_OPTIONS.map(
        (languageOption: LanguageOption): AvailableLanguage =>
          languageOption.value,
      ),
      defaultLang: DEFAULT_LANGUAGE_OPTION.value,
    },
    ...translocoTestingOptions,
  });
}
