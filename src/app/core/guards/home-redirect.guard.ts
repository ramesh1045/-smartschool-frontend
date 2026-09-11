import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Used on the shell's index ('') child route so visiting '/' while logged
 * in lands on the right dashboard for the user's role, instead of an empty
 * page. Always returns a redirect - never renders anything itself.
 */
export const homeRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return router.createUrlTree([authService.homeRouteForCurrentUser()]);
};
