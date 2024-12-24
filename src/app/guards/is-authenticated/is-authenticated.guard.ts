import { inject } from '@angular/core';
import {
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  UrlTree,
} from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';

export const isAuthenticatedGuard: CanActivateFn = (
  _activatedRouteSnapshot,
  routerStateSnapshot,
): MaybeAsync<GuardResult> => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  return authenticationService
    .getSession()
    .then(({ data, error }): boolean | UrlTree => {
      return error || data.session === null
        ? router.createUrlTree(['/sign-in'], {
            queryParams: { [QueryParam.ReturnUrl]: routerStateSnapshot.url },
          })
        : true;
    })
    .catch((): UrlTree => {
      return router.createUrlTree(['/sign-in'], {
        queryParams: { [QueryParam.ReturnUrl]: routerStateSnapshot.url },
      });
    });
};
