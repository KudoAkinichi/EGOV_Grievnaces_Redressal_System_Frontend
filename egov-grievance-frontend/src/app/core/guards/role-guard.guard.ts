import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';
import { DISABLE_GUARDS } from './guard-bypass';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole(route);
  }

  private checkRole(route: ActivatedRouteSnapshot): boolean {
    if (DISABLE_GUARDS) {
      return true; // ✅ bypass role checks
    }

    const allowedRoles = route.data['roles'] as UserRole[];

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    if (this.authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    const dashboardRoute = this.authService.getDashboardRoute();
    this.router.navigate([dashboardRoute]);
    return false;
  }
}
