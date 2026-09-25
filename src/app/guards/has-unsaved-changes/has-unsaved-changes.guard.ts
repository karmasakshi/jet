import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { DialogService } from '@jet/services/dialog/dialog.service';
import { translate } from '@jsverse/transloco';

export const hasUnsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  _activatedRouteSnapshot,
  _currentRouterStateSnapshot,
  nextRouterStateSnapshot,
): boolean | Promise<boolean> => {
  const dialogService = inject(DialogService);

  if (nextRouterStateSnapshot.url.startsWith('/sign-in')) {
    return true;
  }

  if (component.hasUnsavedChanges()) {
    return dialogService.confirm({
      message: translate('confirmations.youll-lose-unsaved-changes-continue'),
    });
  }

  return true;
};
