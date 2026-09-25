import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { UserService } from '@jet/services/user/user.service';

export const isSignedOutGuard: CanActivateFn = (): GuardResult => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.isSignedIn() ? router.createUrlTree(['/']) : true;
};
