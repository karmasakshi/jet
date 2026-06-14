/* eslint-disable no-alert */

import { CanDeactivateFn, GuardResult } from '@angular/router';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { translate } from '@jsverse/transloco';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  _activatedRouteSnapshot,
  _currentRouterStateSnapshot,
  nextRouterStateSnapshot,
): GuardResult => {
  if (nextRouterStateSnapshot.url.startsWith('/sign-in')) {
    return true;
  }

  if (component.hasUnsavedChanges()) {
    return confirm(translate('confirmations.youll-lose-unsaved-changes-continue'));
  }

  return true;
};
