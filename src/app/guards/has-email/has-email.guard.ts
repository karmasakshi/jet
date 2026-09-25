import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router } from '@angular/router';
import { UserService } from '@jet/services/user/user.service';

export const hasEmailGuard: CanActivateFn = (): GuardResult => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.hasEmail() ? true : router.createUrlTree(['/not-found']);
};
