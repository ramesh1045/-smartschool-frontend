import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { environment } from '../../../environments/environment';

/**
 * Central HTTP error handling:
 * - 401 on any API call (except the auth endpoints themselves) triggers
 *   exactly one silent refresh attempt, then retries the original request
 *   with the new access token. If the refresh also fails, the user is
 *   logged out and sent to /login.
 * - Every other error surfaces as a toast with the server's message, so
 *   individual components don't need to repeat this handling.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toast = inject(ToastService);
  const isAuthEndpoint = req.url.startsWith(`${environment.apiUrl}/auth/`);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401 && !isAuthEndpoint) {
        return from(authService.refreshAccessToken()).pipe(
          switchMap((newToken) => {
            const retried = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true,
            });
            return next(retried);
          }),
          catchError((refreshError) => {
            toast.error('Your session has expired. Please log in again.');
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      const message = (error.error as { message?: string })?.message ?? 'Something went wrong. Please try again.';
      if (error.status !== 401) {
        toast.error(message);
      }

      return throwError(() => error);
    })
  );
};
