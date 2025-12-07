import { FontPair } from '@jet/types/font-pair.type';
import { Language } from '@jet/types/language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontPair: FontPair;
  fontPairUrl: string;
  icon: string;
  nameKey: string;
  value: Language;
}
