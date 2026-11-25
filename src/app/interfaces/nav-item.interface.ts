import { Badge } from '@jet/types/badge.type';
import { SvgIcon } from '@jet/types/svg-icon.type';

export interface NavItem {
  badge: Badge | null;
  nameKey: string;
  path: string;
  svgIcon: SvgIcon;
}
