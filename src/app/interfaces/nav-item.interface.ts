import { Badge } from '@jet/types/badge.type';

export interface NavItem {
  badge: Badge | null;
  iconName: string;
  nameKey: string;
  path: string;
}
