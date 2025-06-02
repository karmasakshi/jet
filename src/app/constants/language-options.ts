import { LanguageOption } from '@jet/interfaces/language-option';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    fontClass: 'default',
    icon: 'translate',
    nameKey: marker('constants.english'),
    value: 'en',
  },
  {
    directionality: 'rtl',
    fontClass: 'arabic',
    icon: 'translate',
    nameKey: marker('constants.arabic'),
    value: 'ar',
  },
];
