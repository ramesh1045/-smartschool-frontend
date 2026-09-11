import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { homeRedirectGuard } from './core/guards/home-redirect.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', canActivate: [homeRedirectGuard], children: [] },
      {
        path: 'super-admin',
        canActivate: [roleGuard(['SUPER_ADMIN'])],
        loadComponent: () =>
          import('./features/super-admin/dashboard/dashboard').then((m) => m.SuperAdminDashboardPlaceholder),
        // Future: children here for /super-admin/schools, etc. (Phase 4)
      },
      {
        path: 'school-admin',
        canActivate: [roleGuard(['SCHOOL_ADMIN'])],
        loadComponent: () =>
          import('./features/school-admin/dashboard/dashboard').then((m) => m.SchoolAdminDashboardPlaceholder),
        // Future: children here for /school-admin/students, /teachers, etc. (Phase 5-6)
      },
      {
        path: 'teacher',
        canActivate: [roleGuard(['TEACHER'])],
        loadComponent: () =>
          import('./features/teacher/dashboard/dashboard').then((m) => m.TeacherDashboardPlaceholder),
        // Future: children here for /teacher/homework, /attendance, etc. (Phase 7-10)
      },
      {
        path: 'parent',
        canActivate: [roleGuard(['PARENT'])],
        loadComponent: () =>
          import('./features/parent/dashboard/dashboard').then((m) => m.ParentDashboardPlaceholder),
        // Future: children here for /parent/homework, /attendance, etc. (Phase 8-13)
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
