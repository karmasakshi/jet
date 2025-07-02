import { ColorSchemeOption } from '@jet/interfaces/color-scheme-option.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const COLOR_SCHEME_OPTIONS: ColorSchemeOption[] = [
  {
    icon: 'contrast',
    nameKey: marker('constants.automatic'),
    themeColor: null,
    value: 'automatic',
  },
  {
    icon: 'light_mode',
    nameKey: marker('constants.light'),
    themeColor: '#fff8f6',
    value: 'light',
  },
  {
    icon: 'dark_mode',
    nameKey: marker('constants.dark'),
    themeColor: '#161311',
    value: 'dark',
  },
];
