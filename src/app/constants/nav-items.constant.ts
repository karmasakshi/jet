import { NavItem } from '@jet/interfaces/nav-item.interface';
import { homeFillIcon } from '@jet/svgs/home-fill';
import { personFillIcon } from '@jet/svgs/person-fill';
import { tuneFillIcon } from '@jet/svgs/tune-fill';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export const NAV_ITEMS: NavItem[] = [
  { badge: null, nameKey: marker('constants.home'), path: '/', svgIcon: homeFillIcon },
  { badge: null, nameKey: marker('constants.profile'), path: '/profile', svgIcon: personFillIcon },
  { badge: null, nameKey: marker('constants.settings'), path: '/settings', svgIcon: tuneFillIcon },
];
