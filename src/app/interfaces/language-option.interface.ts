import { AvailableFontPairClass } from '@jet/types/available-font-pair-class.type';
import { AvailableLanguage } from '@jet/types/available-language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontPairClass: AvailableFontPairClass;
  fontPairUrl: string;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
