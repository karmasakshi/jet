import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QueryParam } from '@jet/enums/query-param.enum';
import { AuthenticationService } from '@jet/services/authentication/authentication.service';

export const authenticatedGuard: CanActivateFn = (
  _activatedRouteSnapshot,
  routerStateSnapshot,
) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.user() !== null) {
    return true;
  } else {
    void router.navigate(['/login'], {
      queryParams: { [QueryParam.ReturnUrl]: routerStateSnapshot.url },
      queryParamsHandling: 'merge',
    });
    return false;
  }
};
