import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    fontPairClass: null,
    iconName: 'translate-fill',
    nameKey: marker('constants.english'),
    value: 'en',
  },
  {
    directionality: 'rtl',
    fontPairClass: 'arabic',
    iconName: 'translate-fill',
    nameKey: marker('constants.arabic'),
    value: 'ar',
  },
];
