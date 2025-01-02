import { inject } from '@angular/core';
import {
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  UrlTree,
} from '@angular/router';
import { UserService } from '@jet/services/user/user.service';

export const isNotAuthenticatedGuard: CanActivateFn =
  (): MaybeAsync<GuardResult> => {
    const router = inject(Router);
    const userService = inject(UserService);

    return userService
      .getSession()
      .then(({ data, error }): boolean | UrlTree => {
        return error || data.session === null
          ? true
          : router.createUrlTree(['/']);
      })
      .catch((): UrlTree => {
        return router.createUrlTree(['/']);
      });
  };
