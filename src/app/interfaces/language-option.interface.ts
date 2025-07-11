import { AvailableFontClass } from '@jet/types/available-font-class.type';
import { AvailableLanguage } from '@jet/types/available-language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  fontClass: AvailableFontClass;
  fontUrl: string;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
