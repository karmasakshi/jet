import { AvailableFontPair } from '@jet/types/available-font-pair.type';
import { AvailableLanguage } from '@jet/types/available-language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontPair: AvailableFontPair;
  fontPairUrl: string;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
