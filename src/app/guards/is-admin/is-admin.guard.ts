import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { UserService } from '@jet/services/user/user.service';

export const isAdminGuard: CanActivateFn = (
  _activatedRouteSnapshot,
  routerStateSnapshot,
): GuardResult => {
  const router = inject(Router);
  const userService = inject(UserService);

  if (!userService.isSignedIn()) {
    return router.createUrlTree(['/sign-in'], {
      queryParams: { [QueryParam.ReturnUrl]: routerStateSnapshot.url },
    });
  }

  return userService.isAdmin() ? true : router.createUrlTree(['/not-found']);
};
