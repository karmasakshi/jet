import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { UserService } from '@jet/services/user/user.service';

export const signedInGuard: CanActivateFn = async (
  _activatedRouteSnapshot,
  routerStateSnapshot,
): Promise<GuardResult> => {
  const router = inject(Router);
  const alertService = inject(AlertService);
  const loggerService = inject(LoggerService);
  const userService = inject(UserService);

  let guardResult: GuardResult = router.createUrlTree(['/sign-in'], {
    queryParams: { [QueryParam.ReturnUrl]: routerStateSnapshot.url },
  });

  try {
    const { data, error } = await userService.getClaims();

    if (error) {
      throw error;
    }

    if (data !== null) {
      guardResult = true;
    }
  } catch (exception: unknown) {
    if (exception instanceof Error) {
      loggerService.logError(exception);
      alertService.showErrorAlert(exception.message);
    } else {
      loggerService.logException(exception);
    }
  }

  return guardResult;
};
