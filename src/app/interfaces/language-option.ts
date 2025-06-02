import { AvailableFontClass } from '@jet/types/available-font-class';
import { AvailableLanguage } from '@jet/types/available-language';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontClass: AvailableFontClass;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
