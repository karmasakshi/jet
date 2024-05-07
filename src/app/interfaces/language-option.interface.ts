import { AvailableFont } from '@jet/types/available-font.type';
import { AvailableLanguage } from '@jet/types/available-language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  font: AvailableFont;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
