import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  ROLE_HOME_ROUTE,
} from '../models/auth.models';

/**
 * Holds the access token in memory only (never localStorage - that would be
 * readable by any injected script, i.e. an XSS vector). The refresh token
 * lives in an httpOnly cookie the browser manages automatically; this
 * service never sees its value.
 *
 * On a hard page reload, the access token is gone (as intended). `restoreSession()`
 * is called once at app startup (see app.config.ts) to silently trade the
 * still-valid refresh cookie for a new access token, so the user doesn't get
 * logged out just because they refreshed the page.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<AuthUser | null>(null);

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly role = computed(() => this.currentUserSignal()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  async login(credentials: LoginRequest): Promise<AuthUser> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials, {
        withCredentials: true, // required so the browser stores the httpOnly refresh cookie
      })
    );

    this.accessTokenSignal.set(response.data.accessToken);
    this.currentUserSignal.set(response.data.user);
    return response.data.user;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      );
    } finally {
      this.clearSession();
      this.router.navigate(['/login']);
    }
  }

  /** Called by the error interceptor when a request gets a 401. */
  async refreshAccessToken(): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<RefreshResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
    );
    this.accessTokenSignal.set(response.data.accessToken);
    return response.data.accessToken;
  }

  /**
   * Called once at app bootstrap. We don't have the user's profile after a
   * bare refresh, so this silently gets a new access token; if that
   * succeeds, the app treats the session as "restored but profile unknown
   * until the next authenticated call populates it" - in practice, guards
   * redirect to login if currentUser is still null, which only happens if
   * this fails (refresh cookie missing/expired).
   */
  async restoreSession(): Promise<void> {
    try {
      await this.refreshAccessToken();
      // NOTE: Phase 4+ will add GET /api/auth/me to repopulate currentUserSignal
      // here from the fresh access token, so a page refresh doesn't need a
      // full re-login. Left as a follow-up since /me doesn't exist yet.
    } catch {
      this.clearSession();
    }
  }

  homeRouteForCurrentUser(): string {
    const role = this.role();
    return role ? ROLE_HOME_ROUTE[role] : '/login';
  }

  private clearSession(): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
  }
}
