/* eslint-disable no-alert */

import { inject } from '@angular/core';
import { CanDeactivateFn, GuardResult } from '@angular/router';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { TranslocoService } from '@jsverse/transloco';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  _activatedRouteSnapshot,
  _currentRouterStateSnapshot,
  nextRouterStateSnapshot,
): GuardResult => {
  const translocoService = inject(TranslocoService);

  if (nextRouterStateSnapshot.url.startsWith('/sign-in')) {
    return true;
  }

  if (component.hasUnsavedChanges()) {
    return confirm(
      translocoService.translate(
        'confirmations.youll-lose-unsaved-changes-continue',
      ),
    );
  }

  return true;
};
