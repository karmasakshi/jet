import { inject } from '@angular/core';
import { CanDeactivateFn, GuardResult } from '@angular/router';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { TranslocoService } from '@jsverse/transloco';

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
): GuardResult => {
  const translocoService = inject(TranslocoService);

  if (!component.hasUnsavedChanges()) {
    return confirm(
      translocoService.translate('confirmations.youll-lose-unsaved-changes'),
    );
  }

  return true;
};
