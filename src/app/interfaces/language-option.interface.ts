import { Language } from '@jet/types/language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontPairClass: null | string;
  iconName: string;
  nameKey: string;
  value: Language;
}
