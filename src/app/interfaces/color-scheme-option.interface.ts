import { AvailableColorScheme } from '@jet/types/available-color-scheme.type';

export interface ColorSchemeOption {
  icon: string;
  nameKey: string;
  themeColor: null | string;
  value: AvailableColorScheme;
}
