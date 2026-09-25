import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const COLOR_SCHEME_OPTIONS: ColorSchemeOption[] = [
  {
    iconName: 'contrast-fill',
    nameKey: marker('constants.automatic'),
    themeColor: '#ffffff',
    value: null,
  },
  {
    iconName: 'light-mode-fill',
    nameKey: marker('constants.light'),
    themeColor: '#fff8f6',
    value: 'light',
  },
  {
    iconName: 'dark-mode-fill',
    nameKey: marker('constants.dark'),
    themeColor: '#161311',
    value: 'dark',
  },
];
