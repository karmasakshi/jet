import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const COLOR_SCHEME_OPTIONS: ColorSchemeOption[] = [
  {
    icon: 'contrast-fill',
    nameKey: marker('constants.automatic'),
    themeColor: '#ffffff',
    value: null,
  },
  {
    icon: 'light-mode-fill',
    nameKey: marker('constants.light'),
    themeColor: '#fff8f6',
    value: 'light',
  },
  {
    icon: 'dark-mode-fill',
    nameKey: marker('constants.dark'),
    themeColor: '#161311',
    value: 'dark',
  },
];
