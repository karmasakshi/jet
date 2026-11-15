import { Direction } from '@jet/types/direction.type';
import { Language } from '@jet/types/language.type';

export interface LanguageOption {
  direction: Direction;
  iconName: string;
  nameKey: string;
  value: Language;
}
