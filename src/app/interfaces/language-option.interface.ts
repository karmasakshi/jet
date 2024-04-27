import { AvailableFont } from '@xxx/types/available-font.type';
import { AvailableLanguage } from '@xxx/types/available-language.type';

export interface LanguageOption {
  directionality: 'ltr' | 'rtl';
  font: AvailableFont;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
