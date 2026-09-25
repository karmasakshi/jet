/* eslint-disable @typescript-eslint/no-unused-vars */

import { Badge } from '@jet/types/badge.type';

export class BadgeContentServiceMock {
  public getBadgeContent(_badge: Badge | null): null | string {
    return null;
  }
}
