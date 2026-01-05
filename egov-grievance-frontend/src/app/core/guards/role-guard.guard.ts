import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();
    const token = authService.getToken();

    // 🔴 No token → login
    if (!token || !user) {
      router.navigate(['/auth/login']);
      return false;
    }

    // 🔴 Role not allowed
    if (!allowedRoles.includes(user.role)) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};
