import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only touch requests going to our own API - never attach our token or
  // credentials to third-party requests (CDNs, etc.) if any are added later.
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const cloned = req.clone({
    withCredentials: true, // so the refresh cookie travels with every API call
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(cloned);
};
