import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    fontClass: 'default',
    fontUrl:
      'https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@100..900',
    icon: 'translate',
    nameKey: marker('constants.english'),
    value: 'en',
  },
  {
    directionality: 'rtl',
    fontClass: 'arabic',
    fontUrl:
      'https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans+Arabic:wght@100..900',
    icon: 'translate',
    nameKey: marker('constants.arabic'),
    value: 'ar',
  },
];
