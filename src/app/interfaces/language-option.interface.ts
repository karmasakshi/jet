import { Direction } from '@jet/types/direction.type';
import { FontPair } from '@jet/types/font-pair.type';
import { Language } from '@jet/types/language.type';

export interface LanguageOption {
  direction: Direction;
  fontPair: FontPair;
  iconName: string;
  nameKey: string;
  value: Language;
}
