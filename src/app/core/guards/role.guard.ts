import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.models';

/**
 * Usage: { path: 'school-admin', canActivate: [roleGuard(['SCHOOL_ADMIN'])], ... }
 *
 * This is a UX guard only (it hides routes the user shouldn't see). It is
 * NOT the security boundary - the backend's roleGuard + tenantMiddleware
 * are what actually enforce access. Never rely on this alone.
 */
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    if (authService.role() && allowedRoles.includes(authService.role()!)) {
      return true;
    }

    // Logged in but wrong role - send them to their own dashboard rather
    // than a dead end.
    return router.createUrlTree([authService.homeRouteForCurrentUser()]);
  };
}
