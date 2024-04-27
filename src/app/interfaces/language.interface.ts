import { AvailableFont } from '@xxx/types/available-font.type';
import { AvailableLanguage } from '@xxx/types/available-language.type';

export interface Language {
  directionality: 'ltr' | 'rtl';
  font: undefined | AvailableFont;
  icon: string;
  nameKey: string;
  value: AvailableLanguage;
}
