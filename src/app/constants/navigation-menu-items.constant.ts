import { NavigationMenuItem } from '@jet/interfaces/navigation-menu-item.interface';

/**
 * Dynamic keys to include in translations (https://github.com/jsverse/transloco-keys-manager?tab=readme-ov-file#dynamic-keys):
 *
 * t(jet-app.home)
 * t(jet-app.account)
 * t(jet-app.settings)
 */

export const NAVIGATION_MENU_ITEMS: NavigationMenuItem[] = [
  {
    icon: 'home',
    nameKey: 'home',
    path: '/',
  },
  {
    icon: 'account_circle',
    nameKey: 'account',
    path: '/account',
  },
  {
    icon: 'settings',
    nameKey: 'settings',
    path: '/settings',
  },
];
