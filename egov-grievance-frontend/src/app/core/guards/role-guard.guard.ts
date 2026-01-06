import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles?: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();
    const user = authService.getCurrentUser();

    // 🔴 No token → login
    if (!token || !user) {
      console.warn('❌ roleGuard: No token or user, redirecting to login');
      router.navigate(['/auth/login']);
      return false;
    }

    // ✅ Get allowed roles from parameter or route data
    const rolesFromParam = allowedRoles || [];
    const rolesFromData = route.data['roles'] || [];
    const allowedRolesList = rolesFromParam.length > 0 ? rolesFromParam : rolesFromData;

    // Check if user has allowed role
    if (allowedRolesList.length > 0 && !allowedRolesList.includes(user.role)) {
      console.warn('❌ roleGuard: User role not allowed:', user.role);
      router.navigate(['/access-denied']);
      return false;
    }

    return true;
  };
};
