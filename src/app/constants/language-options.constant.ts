import { LanguageOption } from '@jet/interfaces/language-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    fontPair: 'ns-bg',
    fontPairUrl:
      'https://fonts.googleapis.com/css2?display=swap&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Noto+Sans:wght@100..900',
    icon: 'translate',
    nameKey: marker('constants.english'),
    value: 'en',
  },
  {
    directionality: 'rtl',
    fontPair: 'nsa-nsa',
    fontPairUrl:
      'https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans+Arabic:wght@100..900',
    icon: 'translate',
    nameKey: marker('constants.arabic'),
    value: 'ar',
  },
];
