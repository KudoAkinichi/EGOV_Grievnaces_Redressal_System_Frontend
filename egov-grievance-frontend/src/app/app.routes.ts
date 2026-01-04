import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard.guard';
import { RoleGuard } from './core/guards/role-guard.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
  },

  {
    path: 'citizen',
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.CITIZEN] },
    loadChildren: () => import('./features/citizen/citizen-module').then((m) => m.CitizenModule),
  },

  {
    path: 'officer',
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.DEPT_OFFICER] },
    loadChildren: () => import('./features/officer/officer-module').then((m) => m.OfficerModule),
  },

  {
    path: 'supervisor',
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPERVISOR] },
    loadChildren: () =>
      import('./features/supervisor/supervisor-module').then((m) => m.SupervisorModule),
  },

  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    loadChildren: () => import('./features/admin/admin-module').then((m) => m.AdminModule),
  },

  {
    path: 'access-denied',
    loadChildren: () => import('./features/error/error.routes').then((m) => m.ERROR_ROUTES),
  },

  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
