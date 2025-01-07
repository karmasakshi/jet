import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { UserService } from '@jet/services/user/user.service';

export const isNotAuthenticatedGuard: CanActivateFn =
  async (): Promise<GuardResult> => {
    const router = inject(Router);
    const alertService = inject(AlertService);
    const loggerService = inject(LoggerService);
    const userService = inject(UserService);

    try {
      const { data, error } = await userService.getSession();

      if (error) {
        throw error;
      }

      if (data.session === null) {
        throw new Error();
      }

      return true;
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        loggerService.logError(exception);
        alertService.showErrorAlert(exception.message);
      } else {
        loggerService.logException(exception);
      }

      return router.createUrlTree(['/']);
    }
  };
