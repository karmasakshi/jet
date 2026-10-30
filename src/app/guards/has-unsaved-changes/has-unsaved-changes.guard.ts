import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { HasUnsavedChanges } from '@jet/interfaces/has-unsaved-changes.interface';
import { DialogService } from '@jet/services/dialog/dialog.service';
import { translate } from '@jsverse/transloco';

export const hasUnsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (
  component,
  _activatedRouteSnapshot,
  _currentRouterStateSnapshot,
  nextRouterStateSnapshot,
): boolean | Promise<boolean> => {
  const dialogService = inject(DialogService);

  if (nextRouterStateSnapshot.url.startsWith('/sign-in')) {
    return true;
  }

  if (component.isDirty()) {
    return dialogService.confirm({
      message: translate('confirmations.youll-lose-unsaved-changes-continue'),
    });
  }

  return true;
};
