export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT';

export interface AuthUser {
  id: number;
  role: UserRole;
  schoolId: number | null;
  username: string;
  email: string | null;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: unknown;
}

/** Maps each role to the base route of its dashboard, used after login. */
export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  SUPER_ADMIN: '/super-admin',
  SCHOOL_ADMIN: '/school-admin',
  TEACHER: '/teacher',
  PARENT: '/parent',
};
