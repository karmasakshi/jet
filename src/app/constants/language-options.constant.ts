import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    font: 'noto-sans',
    icon: 'translate',
    nameKey: marker('constants.english'),
    value: 'en',
  },
  {
    directionality: 'rtl',
    font: 'noto-sans-arabic',
    icon: 'translate',
    nameKey: marker('constants.arabic'),
    value: 'ar',
  },
];
