import { FontPairClass } from '@jet/types/font-pair-class.type';
import { Language } from '@jet/types/language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontPairClass: FontPairClass | null;
  icon: string;
  nameKey: string;
  value: Language;
}
