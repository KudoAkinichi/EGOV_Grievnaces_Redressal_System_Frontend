import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard.guard';
import { roleGuard } from './core/guards/role-guard.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { UserRole } from './core/models/user.model';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // 🔓 AUTH
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
  },

  // 🔐 PROTECTED AREA
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // ✅ CITIZEN
      {
        path: 'citizen',
        loadChildren: () =>
          import('./features/citizen/citizen-module').then((m) => m.CitizenModule),
        canActivate: [roleGuard(['CITIZEN'])],
      },

      // ✅ OFFICER
      {
        path: 'officer',
        loadChildren: () =>
          import('./features/officer/officer-module').then((m) => m.OfficerModule),
        canActivate: [roleGuard(['DEPT_OFFICER'])],
      },

      // ✅ SUPERVISOR (FIXED)
      {
        path: 'supervisor',
        loadChildren: () =>
          import('./features/supervisor/supervisor-module').then((m) => m.SupervisorModule),
        canActivate: [roleGuard(['SUPERVISOR'])],
      },

      // ✅ ADMIN
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin-module').then((m) => m.AdminModule),
        canActivate: [roleGuard(['ADMIN'])],
      },
    ],
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
