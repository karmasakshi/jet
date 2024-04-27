import { LanguageOption } from '@xxx/interfaces/language-option.interface';
import { DEFAULT_FONT } from './default-font.constant';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    directionality: 'ltr',
    font: DEFAULT_FONT,
    icon: 'translate',
    nameKey: 'english',
    value: 'en',
  },
  {
    directionality: 'rtl',
    font: 'noto-sans-arabic',
    icon: 'translate',
    nameKey: 'arabic',
    value: 'ar',
  },
];
