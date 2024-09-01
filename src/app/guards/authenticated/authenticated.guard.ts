import { inject } from '@angular/core';
import {
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
} from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';

export const authenticatedGuard: CanActivateFn = (
  _activatedRouteSnapshot,
  routerStateSnapshot,
): MaybeAsync<GuardResult> => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  if (authenticationService.user() !== null) {
    return true;
  } else {
    return router.createUrlTree(['/login'], {
      queryParams: { [QueryParam.ReturnUrl]: routerStateSnapshot.url },
      queryParamsHandling: 'merge',
    });
  }
};
