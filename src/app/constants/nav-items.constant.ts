import { NavItem } from '@jet/interfaces/nav-item.interface';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const NAV_ITEMS: NavItem[] = [
  { badge: null, iconName: 'home-fill', nameKey: marker('constants.home'), path: '/' },
  { badge: null, iconName: 'person-fill', nameKey: marker('constants.profile'), path: '/profile' },
  { badge: null, iconName: 'tune-fill', nameKey: marker('constants.settings'), path: '/settings' },
];
