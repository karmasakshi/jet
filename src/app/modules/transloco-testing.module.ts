import { DEFAULT_LANGUAGE_OPTION } from '@jet/constants/default-language-option.constant';
import { LANGUAGE_OPTIONS } from '@jet/constants/language-options.constant';
import { LanguageOption } from '@jet/interfaces/language-option.interface';
import ar from '@jet/public/i18n/ar.json';
import en from '@jet/public/i18n/en.json';
import { AvailableLanguage } from '@jet/types/available-language.type';
import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';

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
