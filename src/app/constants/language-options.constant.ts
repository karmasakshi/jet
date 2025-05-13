import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    fontPair: 'noto-sans',
    icon: 'translate',
    nameKey: marker('constants.english'),
    value: 'en',
  },
  {
    directionality: 'rtl',
    fontPair: 'noto-sans-arabic',
    icon: 'translate',
    nameKey: marker('constants.arabic'),
    value: 'ar',
  },
];
