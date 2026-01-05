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

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as UserRole[];
    const role = this.authService.getCurrentUserRole();

    if (!role || !allowedRoles.includes(role)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
