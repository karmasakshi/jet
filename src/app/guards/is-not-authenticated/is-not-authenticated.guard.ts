import { inject } from '@angular/core';
import {
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';

export const isNotAuthenticatedGuard: CanActivateFn =
  (): MaybeAsync<GuardResult> => {
    const router = inject(Router);
    const authenticationService = inject(AuthenticationService);

    return authenticationService
      .getSession()
      .then(({ data, error }): boolean | UrlTree => {
        if (error || data.session === null) {
          return true;
        } else {
          return router.createUrlTree(['/']);
        }
      })
      .catch((): UrlTree => {
        return router.createUrlTree(['/']);
      });
  };
