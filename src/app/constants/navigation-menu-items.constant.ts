import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const NAVIGATION_MENU_ITEMS: NavigationMenuItem[] = [
  { icon: 'home', nameKey: marker('constants.home'), path: '/' },
  { icon: 'person', nameKey: marker('constants.profile'), path: '/profile' },
  {
    icon: 'settings',
    nameKey: marker('constants.settings'),
    path: '/settings',
  },
];
